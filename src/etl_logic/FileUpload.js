function onSubmit(event) {
  const self = this;
  /**
   * 삭제한 검증
   *    - Validation(Turn it in)
   *    - 아무 파일도 없을때(공허한 파일 혹은 파일이 없는 경우)
   *
   */
  const valid =
    !$(this).is("#submit_online_text_entry_form") ||
    $(this).validateForm({
      object_name: "submission",
      required: ["body"],
    });
  if (!valid) return false;

  if ($(this).attr("id") == "submit_online_upload_form") {
    event.preventDefault() && event.stopPropagation();
    const fileElements = $(this)
      .find("input[type=file]:visible")
      .filter(function () {
        return $(this).val() !== ""; // C://fakepath/... is not empty
      });

    const uploadedAttachmentIds = $(this)
      .find("#submission_attachment_ids")
      .val();

    // If there are restrictions on file type, don't accept submission if the file extension is not allowed
    if (ENV.SUBMIT_ASSIGNMENT.ALLOWED_EXTENSIONS.length > 0) {
      const subButton = $(this).find("button[type=submit]");
      let badExt = false;
      $.each(uploadedAttachmentIds.split(","), (index, id) => {
        if (id.length > 0) {
          const ext = $("#submission_attachment_ids")
            .data(String(id))
            .split(".")
            .pop()
            .toLowerCase();
          if ($.inArray(ext, ENV.SUBMIT_ASSIGNMENT.ALLOWED_EXTENSIONS) < 0) {
            badExt = true;
            $.flashError(
              I18n.t(
                "#errors.wrong_file_extension",
                'The file you selected with extension "%{extension}", is not authorized for submission',
                { extension: ext }
              )
            );
          }
        }
      });
      if (badExt) {
        subButton
          .text(I18n.t("#button.submit_assignment", "Submit Assignment"))
          .prop("disabled", false);
        return false;
      }
    }

    $.ajaxJSONPreparedFiles.call(this, {
      handle_files(attachments, data) {
        const ids = (data["submission[attachment_ids]"] || "").split(",");
        for (const idx in attachments) {
          ids.push(attachments[idx].id);
        }
        data["submission[attachment_ids]"] = ids.join(",");
        return data;
      },
      context_code: $("#submit_assignment").data("context_code"),
      asset_string: $("#submit_assignment").data("asset_string"),
      intent: "submit",
      file_elements: fileElements,
      formData: $(this).getFormData(),
      formDataTarget: "url",
      url: $(this).attr("action"),
      onProgress: progressIndicator,
      success(data) {
        submitting = true;
        const url = new URL(window.location.href);
        url.hash = "";
        if (window.ENV.CONFETTI_ENABLED && !data?.submission?.late) {
          url.searchParams.set("confetti", "true");
        }
        window.location = url.toString();
      },
      error(data) {
        submissionForm
          .find("button[type='submit']")
          .text(
            I18n.t("messages.submit_failed", "Submit Failed, please try again")
          );
        submissionForm.find("button").attr("disabled", false);
      },
    });
  } else {
    submitting = true;
  }
}
