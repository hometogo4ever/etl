import { uploadFile } from "./FileUploadLogic.js";
import axios from "axios";

function ajaxJSONPreparedFiles(options) {
  const list = [];
  const $this = this;
  const pre_list = options.files || options.file_elements || [];
  const preferFileValueForInputName =
    options.preferFileValueForInputName == null
      ? true
      : options.preferFileValueForInputName;
  for (let idx = 0; idx < pre_list.length; idx++) {
    const item = pre_list[idx];
    const name = preferFileValueForInputName
      ? item.value || item.name
      : item.name || item.value;
    item.name = name.split(/(\/|\\)/).pop();
    list.push(item);
  }
  const attachments = [];
  const ready = function () {
    let data = options.formDataTarget == "url" ? options.formData : {};
    if (options.handle_files) {
      let result = attachments;
      if (options.single_file) {
        result = attachments[0];
      }
      data = options.handle_files.call(this, result, data);
    }
    if (options.url && options.success && data !== false) {
      axios
        .post(options.url, data)
        .then((response) => {
          options.success(response.data);
        })
        .catch((error) => {
          options.error(error);
        });
    }
  };
  const uploadUrl = options.uploadDataUrl || "/files/pending";
  const upload = function (parameters, file) {
    // we want the s3 success url in the preflight response, not embedded in
    // the upload_url. the latter doesn't work with the new ajax mechanism
    parameters.no_redirect = true;
    file = file.files[0];
    uploadFile(uploadUrl, parameters, file)
      .then((data) => {
        attachments.push(data);
        next.call($this);
      })
      .catch((error) => {
        (options.upload_error || options.error).call($this, error);
      });
  };
  var next = function () {
    const item = list.shift();
    if (item) {
      const attrs = $.extend(
        {
          name: item.name,
          on_duplicate: "rename",
          no_redirect: true,
          "attachment[folder_id]": options.folder_id,
          "attachment[intent]": options.intent,
          "attachment[asset_string]": options.asset_string,
          "attachment[filename]": item.name,
          "attachment[size]": item.size,
          "attachment[context_code]": options.context_code,
          "attachment[on_duplicate]": "rename",
        },
        options.formDataTarget == "uploadDataUrl" ? options.formData : {}
      );
      if (item.files.length === 1) {
        attrs["attachment[content_type]"] = item.files[0].type;
      }
      upload.call($this, attrs, item);
    } else {
      ready.call($this);
    }
  };
  next.call($this);
}

export default ajaxJSONPreparedFiles;
