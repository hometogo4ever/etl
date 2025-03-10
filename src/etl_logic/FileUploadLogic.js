/* file_upload.js */
import axios from "axios";
import FormData from "form-data";
import qs from "qs";

/**
 * 사전 업로드 요청(preflight)이 실패한 경우의 에러 처리
 */
function preflightFailed(err) {
  // Node.js에서는 정확한 에러 메시지가 다를 수 있어,
  // 'Network Error' 외에도 필요한 조건이 있다면 추가 가능.
  const isNetworkError = err.message && err.message.includes("Network Error");
  if (isNetworkError) {
    const wrapped = new Error("Failed to initiate file upload (preflight).");
    wrapped.originalError = err;
    return Promise.reject(wrapped);
  }
  return Promise.reject(err);
}

/**
 * 실제 파일 전송(POST) 중 발생한 에러 처리
 */
function fileUploadFailed(err) {
  const isNetworkError = err.message && err.message.includes("Network Error");
  if (isNetworkError) {
    const wrapped = new Error(
      "Failed to transmit file to the storage service."
    );
    wrapped.originalError = err;
    return Promise.reject(wrapped);
  }
  return Promise.reject(err);
}

/**
 * 업로드 완료 후 최종 메타데이터 확인 등의 과정에서 실패한 에러 처리
 */
function postUploadFailed(err) {
  const isNetworkError = err.message && err.message.includes("Network Error");
  if (isNetworkError) {
    const wrapped = new Error(
      "Failed to complete file upload post-processing."
    );
    wrapped.originalError = err;
    return Promise.reject(wrapped);
  }
  return Promise.reject(err);
}

/**
 * 1) 사전 업로드(preflight) 요청
 * 2) preflight 응답으로부터 업로드 정보를 받아
 *    completeUpload 로 넘어가는 함수
 *
 * @param {string} preflightUrl  /api/... 등 업로드 사전 정보 받을 API 주소
 * @param {object} preflightData { name, size, type, url? (클론 시), ... }
 * @param {File|Blob|Buffer} [file]  실제 업로드할 파일 객체 (없으면 url 기반 복제)
 * @returns 업로드 후 파일 메타데이터(또는 성공 결과)
 */
export async function uploadFile(preflightUrl, preflightData, file) {
  if (!file && !preflightData.url) {
    throw new Error("Expected either a file to upload or a url to clone.");
  } else if (file && preflightData.url) {
    throw new Error("Can't upload with both a file object and a url to clone.");
  }

  // Canvas/서버 측에서 redirect 대신 JSON/문서 응답으로 받도록 강제
  preflightData.no_redirect = true;

  // 특정 key(attachment[context_code] 등)가 있으면, 서버가 URL-encoded 방식을 원할 수 있음
  if (preflightData["attachment[context_code]"]) {
    preflightData = qs.stringify(preflightData);
  }

  let response;
  try {
    // 사전 업로드(preflight) 요청
    response = await axios.post(preflightUrl, preflightData);
  } catch (err) {
    return preflightFailed(err);
  }

  // 사전 요청에 성공하면, response.data를 넘겨 실제 업로드 수행
  return completeUpload(response.data, file);
}

/**
 * preflight 결과로 받은 정보를 토대로 실제 파일 업로드(S3나 Canvas 등)하고,
 * 성공 시 필요한 후속 요청(success_url) 등을 통해 최종 파일 정보를 반환
 *
 * @param {object} preflightResponse preflight에서 받은 응답 (upload_url, params 등)
 * @param {File|Blob|Buffer} [file]  실제 업로드할 파일
 * @param {object} [options]         filename, ignoreResult 등(선택)
 */
export async function completeUpload(preflightResponse, file, options = {}) {
  if (!preflightResponse) {
    throw new Error("Expected a valid preflight response.");
  }

  // 혹시 attachments 배열로 감싸져 온 경우, 첫 번째 요소 사용
  if (preflightResponse.attachments && preflightResponse.attachments[0]) {
    preflightResponse = preflightResponse.attachments[0];
  }

  const {
    upload_url, // 실제 업로드할 S3나 서버 URL
    upload_params, // 업로드 시 함께 전송해야 할 파라미터들
    success_url, // (S3 등) 업로드 후 최종 확인 호출용 URL
    file_param, // 기본값: "file"
  } = preflightResponse;

  if (!upload_url) {
    throw new Error("No upload_url found in the preflight response.");
  }

  // FormData 구성 (Node에서는 form-data 라이브러리 사용)
  const formData = new FormData();
  if (upload_params) {
    for (const [key, value] of Object.entries(upload_params)) {
      formData.append(key, value);
    }
  }

  const paramName = file_param || "file";
  if (file) {
    // Node에서는 file 자체가 Buffer나 Stream일 수 있음
    const filename = options.filename || file.name || "uploaded_file";
    formData.append(paramName, file, filename);
  }

  // 실제 업로드 요청
  let uploadResponse;
  try {
    uploadResponse = await axios.post(upload_url, formData, {
      // S3에서 XML로 응답하는 경우, Node에서 'document'를 지원 안 하므로 'text' 사용 후 직접 파싱 가능
      responseType: "text",
    });
  } catch (err) {
    return fileUploadFailed(err);
  }

  // 만약 success_url이 있으면, 업로드 후 최종 마무리 요청(파일 메타정보 받기 등)을 진행
  if (success_url) {
    // S3 응답이 XML일 경우, uploadResponse.data에서 <Bucket>, <Key>, <ETag> 등을 파싱해야 함
    // 여기서는 간단히 하드코딩 예시만 표시:
    const Bucket = "BucketPlaceholder";
    const Key = "KeyPlaceholder";
    const ETag = "ETagPlaceholder";

    const query = qs.stringify({ bucket: Bucket, key: Key, etag: ETag });
    let location = success_url;
    location += success_url.includes("?") ? `&${query}` : `?${query}`;

    let finalResponse;
    try {
      finalResponse = await axios.get(location);
    } catch (err) {
      return postUploadFailed(err);
    }

    return finalResponse.data;
  } else {
    // success_url이 없으면, 이미 uploadResponse.data가 최종 정보일 수 있음
    return uploadResponse.data;
  }
}

/**
 * 여러 파일을 한 번에 업로드.
 * 파일 객체(Blob/Buffer)인지, 혹은 { url: ... } 형태로 "원격 URL 복제"인지에 따라 분기
 *
 * @param {Array<File|Blob|Buffer|Object>} files  파일 목록
 * @param {string} uploadUrl                      업로드 대상 preflight URL
 * @returns Promise.all 로 모든 업로드 결과 배열
 */
export async function uploadFiles(files, uploadUrl) {
  const promises = files.map((file) => {
    // file.url 존재 시, "URL 복제" 방식
    if (file.url) {
      return uploadFile(uploadUrl, {
        url: file.url,
        name: file.title || "remote_file",
        content_type: file.mediaType || "application/octet-stream",
      });
    }
    // 로컬 실제 파일(Blob/Buffer)인 경우
    else {
      return uploadFile(
        uploadUrl,
        {
          name: file.name || "local_file",
          content_type: file.type || "application/octet-stream",
        },
        file
      );
    }
  });
  return Promise.all(promises);
}

/**
 * (선택) 과제 댓글 등에 다중 파일을 업로드해야 하는 특정 시나리오 예시
 *
 * @param {Array<File|Blob|Buffer>} files     업로드할 파일 목록
 * @param {number} courseId                  코스 ID
 * @param {number} assignmentId              과제 ID
 * @returns Promise.all([...])로 모든 첨부파일 업로드 결과
 */
export async function submissionCommentAttachmentsUpload(
  files,
  courseId,
  assignmentId
) {
  const url = `/api/v1/courses/${courseId}/assignments/${assignmentId}/submissions/self/comments/files`;
  const promises = files.map((file) => {
    const data = {
      name: file.name || "comment_file",
      content_type: file.type || "application/octet-stream",
    };
    return uploadFile(url, data, file);
  });
  return Promise.all(promises);
}
