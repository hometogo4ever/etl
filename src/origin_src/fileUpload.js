function Some(e, t, n) {
  "use strict";
  var r = n("xe+K");
  var a = n("u7Gu");
  var i = n("c9Sg");
  var o = n("ouhR");
  var s = n.n(o);
  var u = n("GLiE");
  var l = n.n(u);
  class c {
    constructor() {
      this.readyState = 0;
      this.timeout = 0;
      this.withCredentials = false;
    }
    setResponse(e) {
      this.readyState = 4;
      this.responseText = e;
      try {
        this.response = s.a.parseJSON(e);
      } catch (e) {
        this.status = 500;
        this.statusText = "500 Internal Server Error";
        return;
      }
      if (this.response.errors) {
        this.status = 400;
        this.statusText = "400 Bad Request";
      } else {
        this.status = 200;
        this.statusText = "200 OK";
      }
      return (this.responseType = "json");
    }
    abort() {}
    getAllResponseHeaders() {
      return this.responseText ? "" : null;
    }
    getResponseHeader() {}
    open() {}
    overrideMimeType() {}
    send() {}
    setRequestHeader() {}
  }
  var d = n("JD5e");
  var f = n("5Ky4");
  n("jYyc");
  n("vpJZ");
  var h = n("hiU6");
  n("UlQx");
  n("JI1W");
  n("MWZS");
  n("s/PJ");
  s.a.fn.formSubmit = function (e) {
    s()(this).markRequired(e);
    this.submit(function (t) {
      const n = s()(this);
      let r = e.onSubmit;
      if (n.data("submitting")) return;
      n.data("trigger_event", t);
      n.hideErrors();
      let i = false;
      const o = n.validateForm(e);
      if (!o) return false;
      let u = n.getFormData(e);
      if (e.processData && s.a.isFunction(e.processData)) {
        let t = null;
        try {
          t = e.processData.call(n, u);
        } catch (e) {
          i = e;
          if (a["a"] && "production" !== a["a"].environment) throw i;
        }
        if (false === t) return false;
        t && (u = t);
      }
      let d =
          n.data("method") ||
          n.find("input[name='_method']").val() ||
          n.attr("method"),
        h = n.attr("id"),
        m = n.attr("action"),
        p = null;
      if (s.a.isFunction(e.beforeSubmit)) {
        p = null;
        try {
          p = e.beforeSubmit.call(n, u);
        } catch (e) {
          i = e;
          if (a["a"] && "production" !== a["a"].environment) throw i;
        }
        if (false === p) return false;
      }
      if (e.disableWhileLoading) {
        const t = r;
        r = function (r) {
          if ("spin_on_success" === e.disableWhileLoading) {
            const e = r;
            r = s.a.Deferred();
            e.fail(() => {
              r.reject();
            });
          }
          n.disableWhileLoading(r);
          t && t.apply(this, arguments);
        };
      }
      if (r) {
        var _ = s.a.Deferred(),
          g = {};
        r.call(this, _, u);
        s.a.each(["success", "error"], function (t, n) {
          g[n] = e[n];
          e[n] = function () {
            _["success" === n ? "resolve" : "reject"].apply(_, arguments);
            if (s.a.isFunction(g[n])) return g[n].apply(this, arguments);
          };
        });
      }
      let y = e.fileUpload;
      if (s.a.isFunction(e.fileUpload))
        try {
          y = e.fileUpload.call(n, u);
        } catch (e) {
          i = e;
        }
      y && e.fileUploadOptions && s.a.extend(e, e.fileUploadOptions);
      n.attr("action") && (m = n.attr("action"));
      if (i && !e.preventDegradeToFormSubmit) {
        _ && _.reject();
        return;
      }
      t.preventDefault();
      t.stopPropagation();
      const b = function (t, r) {
        s.a.isFunction(e.success) && e.success.call(n, t, p, r);
      };
      const v = function (t, r) {
        let a = n,
          i = true;
        if (s.a.isFunction(e.error)) {
          const o = e.error.call(n, t.errors || t, p, r);
          o && (a = o);
          i = false;
        }
        if (
          a.parents("html").get(0) == s()("html").get(0) &&
          false !== e.formErrors
        ) {
          s.a.isFunction(e.errorFormatter) &&
            (t = e.errorFormatter(t.errors || t));
          a.formErrors(t, e);
        } else i && s.a.ajaxJSON.unhandledXHRs.push(r);
      };
      if (e.noSubmit) b.call(this, u, {});
      else if (y && e.preparedFileUpload && e.context_code)
        //미리 업로드된 파일을 업로드 하기
        s.a.ajaxJSONPreparedFiles.call(this, {
          handle_files: e.upload_only ? b : e.handle_files,
          single_file: e.singleFile,
          context_code: s.a.isFunction(e.context_code)
            ? e.context_code.call(n)
            : e.context_code,
          asset_string: e.asset_string,
          intent: e.intent,
          folder_id: s.a.isFunction(e.folder_id)
            ? e.folder_id.call(n)
            : e.folder_id,
          file_elements: n.find("input[type='file']:visible"),
          files: s.a.isFunction(e.files) ? e.files.call(n) : e.files,
          url: e.upload_only ? null : m,
          method: e.method,
          uploadDataUrl: e.uploadDataUrl,
          formData: u,
          formDataTarget: e.formDataTarget,
          success: b,
          error: v,
          preferFileValueForInputName: e.preferFileValueForInputName,
        });
      else if (y && s.a.handlesHTML5Files && n.hasClass("handlingHTML5Files")) {
        const e = s.a.extend({}, u);
        n.find("input[type='file']").each(function () {
          const t = s()(this),
            n = t.data("file_list");
          n && n instanceof FileList && (e[t.attr("name")] = n);
        });
        s.a.toMultipartForm(e, (e) => {
          s.a.sendFormAsBinary({
            url: m,
            body: e.body,
            content_type: e.content_type,
            form_data: e.form_data,
            method: d,
            success: b,
            error: v,
          });
        });
      } else if (y) {
        const t = l.a.uniqueId(h + "_"),
          r = s()(
            "<div style='display: none;' id='box_" +
              Object(f["a"])(t) +
              "'><iframe id='frame_" +
              Object(f["a"])(t) +
              "' name='frame_" +
              Object(f["a"])(t) +
              "' src='about:blank' onload='$(\"#frame_" +
              Object(f["a"])(t) +
              '").triggerHandler("form_response_loaded");\'></iframe>'
          )
            .appendTo("body")
            .find("#frame_" + t),
          a = n.attr("target"),
          i = n.attr("ENCTYPE"),
          o = new c();
        n.attr({
          method: d,
          action: m,
          ENCTYPE: "multipart/form-data",
          encoding: "multipart/form-data",
          target: "frame_" + t,
        });
        if (e.onlyGivenParameters) {
          n.find("input[name='_method']").remove();
          n.find("input[name='authenticity_token']").remove();
        }
        s.a.ajaxJSON.storeRequest(o, m, d, u);
        r.bind("form_response_loaded", function () {
          const e = r[0],
            u = e.contentDocument || e.contentWindow.document;
          if ("about:blank" == u.location.href) return;
          o.setResponse(s()(u).text());
          if (s.a.httpSuccess(o)) b.call(this, o.response, o);
          else {
            v.call(this, o.response, o);
            s.a.fn.defaultAjaxError.func.call(
              s.a.fn.defaultAjaxError.object,
              null,
              o,
              "0",
              null
            );
          }
          setTimeout(() => {
            n.attr({ ENCTYPE: i, encoding: i, target: a });
            s()("#box_" + t).remove();
          }, 5e3);
        });
        n.data("submitting", true).submit().data("submitting", false);
      } else s.a.ajaxJSON(m, d, u, b, v);
    });
    return this;
  };
  s.a.ajaxJSONPreparedFiles = function (e) {
    const t = [];
    const r = this;
    const a = e.files || e.file_elements || [];
    const i =
      null == e.preferFileValueForInputName || e.preferFileValueForInputName;
    for (let e = 0; e < a.length; e++) {
      const n = a[e];
      const r = i ? n.value || n.name : n.name || n.value;
      n.name = r.split(/(\/|\\)/).pop();
      t.push(n);
    }
    const o = [];
    const u = function () {
      let t = "url" == e.formDataTarget ? e.formData : {};
      if (e.handle_files) {
        let n = o;
        e.single_file && (n = o[0]);
        t = e.handle_files.call(this, n, t);
      }
      e.url &&
        e.success &&
        false !== t &&
        s.a.ajaxJSON(e.url, e.method, t, e.success, e.error);
    };
    // FILE UPLOADING
    const l = e.uploadDataUrl || "/files/pending";
    const c = function (t, a) {
      t.no_redirect = true;
      a = a.files[0];
      Promise.all([n.e(2), n.e(24)])
        .then(n.bind(null, "60Hp"))
        .then((n) => {
          let r = n.uploadFile;
          return r(l, t, a, void 0, e.onProgress);
        })
        .then((e) => {
          o.push(e);
          d.call(r);
        })
        .catch((t) => {
          (e.upload_error || e.error).call(r, t);
        });
    };
    var d = function () {
      const n = t.shift();
      if (n) {
        const t = s.a.extend(
          {
            name: n.name,
            on_duplicate: "rename",
            no_redirect: true,
            "attachment[folder_id]": e.folder_id,
            "attachment[intent]": e.intent,
            "attachment[asset_string]": e.asset_string,
            "attachment[filename]": n.name,
            "attachment[size]": n.size,
            "attachment[context_code]": e.context_code,
            "attachment[on_duplicate]": "rename",
          },
          "uploadDataUrl" == e.formDataTarget ? e.formData : {}
        );
        1 === n.files.length &&
          (t["attachment[content_type]"] = n.files[0].type);
        c.call(r, t, n);
      } else u.call(r);
    };
    d.call(r);
  };
  s.a.ajaxJSONFiles = function (e, t, n, r, a, i, o) {
    const u = s()(document.createElement("form"));
    u.attr("action", e).attr("method", t);
    n.authenticity_token = Object(d["a"])();
    const l = {};
    r.each(function () {
      l[s()(this).attr("name")] = true;
    });
    for (const e in n)
      if (!l[e]) {
        const t = s()(document.createElement("input"));
        t.attr("type", "hidden").attr("name", e).attr("value", n[e]);
        u.append(t);
      }
    r.each(function () {
      const e = s()(this).clone(true);
      s()(this).after(e);
      u.append(s()(this));
      s()(this).removeAttr("id");
    });
    s()("body").append(u.hide());
    u.formSubmit({
      fileUpload: true,
      success: a,
      onlyGivenParameters: !!o && o.onlyGivenParameters,
      error: i,
    });
    u.submit();
  };
  s.a.handlesHTML5Files = !!(
    window.File &&
    window.FileReader &&
    window.FileList &&
    XMLHttpRequest
  );
  s.a.handlesHTML5Files &&
    s()("input[type='file']").live("change", function (e) {
      const t = this.files;
      if (t) {
        s()(this).data("file_list", t);
        s()(this).parents("form").addClass("handlingHTML5Files");
      }
    });
  s.a.ajaxFileUpload = function (e) {
    e.data.authenticity_token = Object(d["a"])();
    s.a.toMultipartForm(e.data, function (t) {
      s.a.sendFormAsBinary(
        {
          url: e.url,
          body: t.body,
          content_type: t.content_type,
          form_data: t.form_data,
          method: e.method,
          success(t) {
            e.success && s.a.isFunction(e.success) && e.success.call(this, t);
          },
          progress(t) {
            e.progress &&
              s.a.isFunction(e.progress) &&
              e.progress.call(this, t);
          },
          error(t, n) {
            if (e.error && s.a.isFunction(e.error)) {
              t = t || {};
              e.error.call(this, t.errors || t);
            } else s.a.ajaxJSON.unhandledXHRs.push(n);
          },
        },
        false === e.binary
      );
    });
  };
  s.a.httpSuccess = function (e) {
    try {
      return (
        (!e.status && "file:" == location.protocol) ||
        (e.status >= 200 && e.status < 300) ||
        304 == e.status ||
        (jQuery.browser.safari && void 0 == e.status)
      );
    } catch (e) {}
    return false;
  };
  s.a.sendFormAsBinary = function (e, t) {
    const n = e.body;
    const r = e.url;
    const a = e.method;
    const i = new XMLHttpRequest();
    if (i.upload) {
      i.upload.addEventListener(
        "progress",
        function (t) {
          e.progress && s.a.isFunction(e.progress) && e.progress.call(this, t);
        },
        false
      );
      i.upload.addEventListener(
        "error",
        function (t) {
          e.error &&
            s.a.isFunction(e.error) &&
            e.error.call(this, "uploading error", i, t);
        },
        false
      );
      i.upload.addEventListener(
        "abort",
        function (t) {
          e.error &&
            s.a.isFunction(e.error) &&
            e.error.call(this, "aborted by the user", i, t);
        },
        false
      );
    }
    i.onreadystatechange = function (t) {
      if (4 == i.readyState) {
        let n = null;
        try {
          n = s.a.parseJSON(i.responseText);
        } catch (e) {}
        s.a.httpSuccess(i) && n && !n.errors
          ? e.success &&
            s.a.isFunction(e.success) &&
            e.success.call(this, n, i, t)
          : e.error &&
            s.a.isFunction(e.error) &&
            e.error.call(this, n || i.responseText, i, t);
      }
    };
    i.open(a, r);
    i.setRequestHeader("Accept", "application/json, text/javascript, */*");
    i.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    if (e.form_data) i.send(e.form_data);
    else {
      i.overrideMimeType(e.content_type || "multipart/form-data");
      i.setRequestHeader(
        "Content-Type",
        e.content_type || "multipart/form-data"
      );
      i.setRequestHeader("Content-Length", n.length);
      t
        ? i.send(n)
        : i.sendAsBinary
        ? i.sendAsBinary(n)
        : console.log("xhr.sendAsBinary not supported");
    }
  };
  s.a.fileData = function (e) {
    return {
      name: e.name || e.fileName,
      size: e.size || e.fileSize,
      type: e.type,
      forced_type: e.type || "application/octet-stream",
    };
  };
  s.a.toMultipartForm = function (e, t) {
    let n = "-----AaB03x" + l.a.uniqueId(),
      r = { content_type: "multipart/form-data; boundary=" + n },
      a = "--" + n + "\r\n",
      i = [],
      o = false;
    for (var u in e) {
      i.push([u, e[u]]);
      e[u] && e[u].fake_file && (o = true);
    }
    if (window.FormData && !o) {
      const n = new FormData();
      for (var u in e) {
        let t = e[u];
        window.FileList && t instanceof FileList && (t = t[0]);
        if (t instanceof Array)
          for (let e = 0; e < t.length; e++) n.append(u, t[e]);
        else n.append(u, t);
      }
      r.form_data = n;
      t(r);
      return;
    }
    function c(e) {
      return e.replace(/\"/g, "");
    }
    function d() {
      r.body = a.substring(0, a.length - 2) + "--";
      t(r);
    }
    function f() {
      if (0 === i.length) {
        d();
        return;
      }
      let e = i.shift(),
        t = e[0],
        r = e[1];
      window.FileList && r instanceof FileList && (r = r[0]);
      if (window.FileList && r instanceof FileList) {
        const e = "-----BbC04y" + l.a.uniqueId(),
          i = [];
        a +=
          'Content-Disposition: form-data; name="' +
          c(t) +
          "\r\nContent-Type: multipart/mixed; boundary=" +
          e +
          "\r\n\r\n";
        for (const e in r) i.push(r);
        const u = function () {
          a += "--" + e + "--\r\n--" + n + "\r\n";
          f();
        };
        var o = function t() {
          if (0 === i.length) {
            u();
            return;
          }
          const n = i.shift(),
            r = s.a.fileData(n),
            o = new FileReader();
          o.onloadend = function () {
            a +=
              "--" +
              e +
              '\r\nContent-Disposition: file; filename="' +
              c(r.name) +
              '"\r\nContent-Type: ' +
              r.forced_type +
              "\r\nContent-Transfer-Encoding: binary\r\n\r\n" +
              o.result;
            t();
          };
          o.readAsBinaryString(n);
        };
        o();
      } else if (window.File && r instanceof File) {
        const e = s.a.fileData(r),
          i = new FileReader();
        i.onloadend = function () {
          a +=
            'Content-Disposition: file; name="' +
            c(t) +
            '"; filename="' +
            e.name +
            '"\r\nContent-Type: ' +
            e.forced_type +
            "\r\nContent-Transfer-Encoding: binary\r\n\r\n" +
            i.result +
            "\r\n--" +
            n +
            "\r\n";
          f();
        };
        i.readAsBinaryString(r);
      } else if (r && r.fake_file) {
        a +=
          'Content-Disposition: file; name="' +
          c(t) +
          '"; filename="' +
          r.name +
          '"\r\nContent-Type: ' +
          r.content_type +
          "\r\nContent-Transfer-Encoding: binary\r\n\r\n" +
          r.content +
          "\r\n--" +
          n +
          "\r\n";
        f();
      } else {
        a +=
          'Content-Disposition: form-data; name="' +
          c(t) +
          '"\r\n\r\n' +
          (r || "").toString() +
          "\r\n--" +
          n +
          "\r\n";
        f();
      }
    }
    f();
  };
  s.a.fn.fillFormData = function (e, t) {
    if (this.length) {
      e = e || [];
      const n = s.a.extend({}, s.a.fn.fillFormData.defaults, t);
      n.object_name && (e = s.a._addObjectName(e, n.object_name, true));
      this.find(":input").each(function () {
        const t = s()(this);
        const r = t.attr("name");
        const a = t.attr("type");
        if (r in e && r) {
          if ("hidden" == a && t.next("input:checkbox").attr("name") == r);
          else if ("checkbox" != a && "radio" != a) {
            let n = e[r];
            ("undefined" !== typeof n && null !== n) || (n = "");
            t.val(n.toString());
          } else
            t.val() == e[r]
              ? t.attr("checked", true)
              : t.attr("checked", false);
          t && t.change && n.call_change && t.change();
        }
      });
    }
    return this;
  };
  s.a.fn.fillFormData.defaults = { object_name: null, call_change: true };
  s.a.fn.getFormData = function (e) {
    e = s.a.extend({}, s.a.fn.getFormData.defaults, e);
    var t = {},
      n = this;
    n.find(":input")
      .not(":button")
      .each(function () {
        const a = s()(this),
          i = a.attr("type");
        if (("radio" == i || "checkbox" == i) && !a.attr("checked")) return;
        let o = a.val();
        a.hasClass("datetime_field_enabled") && (o = a.data("iso8601"));
        try {
          a.data("rich_text") && (o = Object(r["d"])(a, "get_code", false));
        } catch (e) {}
        const u = a.prop("name") || "";
        const l = u.match(/\[\]$/);
        if (
          "hidden" == i &&
          !l &&
          n
            .find("[name='" + u + "']")
            .filter(
              "textarea,:radio:checked,:checkbox:checked,:text,:password,select,:hidden"
            )[0] != a[0]
        )
          return;
        if (
          u &&
          "" !== u &&
          ("checkbox" == i || "undefined" === typeof t[u] || l) &&
          (!e.values || -1 != s.a.inArray(u, e.values))
        )
          if (l) {
            t[u] = t[u] || [];
            t[u].push(o);
          } else t[u] = o;
      });
    e.object_name && (t = s.a._stripObjectName(t, e.object_name, true));
    return t;
  };
  s.a.fn.getFormData.defaults = { object_name: null };
  s.a._addObjectName = function (e, t, n) {
    if (!e) return e;
    let r = {};
    e instanceof Array && (r = []);
    let a, i, o;
    for (const s in e) {
      a = e instanceof Array ? e[s] : s;
      o = a.indexOf("[");
      i =
        o >= 0
          ? t + "[" + a.substring(0, o) + "]" + a.substring(o)
          : t + "[" + a + "]";
      if ("string" === typeof a && 0 === a.indexOf("=")) {
        i = a.substring(1);
        a = i;
      }
      if (e instanceof Array) {
        r.push(i);
        n && r.push(a);
      } else {
        r[i] = e[s];
        n && (r[a] = e[s]);
      }
    }
    return r;
  };
  s.a._stripObjectName = function (e, t, n) {
    let r = {};
    let a;
    e instanceof Array && (r = []);
    for (const s in e) {
      var i, o;
      i = e instanceof Array ? e[s] : s;
      if ((o = 0 === i.indexOf(t + "["))) {
        a = i.replace(t + "[", "");
        const n = a.indexOf("]");
        a = a.substring(0, n) + a.substring(n + 1);
        e instanceof Array ? r.push(a) : (r[a] = e[s]);
      }
      (o && !n) || (e instanceof Array ? r.push(e[s]) : (r[s] = e[s]));
    }
    return r;
  };
  s.a.fn.validateForm = function (e) {
    if (0 === this.length) return false;
    e = s.a.extend({}, s.a.fn.validateForm.defaults, e);
    var t = this,
      n = {},
      r = e.data || t.getFormData(e);
    if (e.object_name) {
      e.required = s.a._addObjectName(e.required, e.object_name);
      e.date_fields = s.a._addObjectName(e.date_fields, e.object_name);
      e.dates = s.a._addObjectName(e.dates, e.object_name);
      e.times = s.a._addObjectName(e.times, e.object_name);
      e.numbers = s.a._addObjectName(e.numbers, e.object_name);
      e.property_validations = s.a._addObjectName(
        e.property_validations,
        e.object_name
      );
    }
    if (e.required) {
      const a = l.a.result(e, "required");
      s.a.each(a, (a, o) => {
        if (!r[o]) {
          n[o] || (n[o] = []);
          let r = e.labels && e.labels[o];
          r = r || t.getFieldLabelString(o);
          n[o].push(
            i["a"].t("errors.required", "Required field") + (r ? ": " + r : "")
          );
        }
      });
    }
    e.date_fields &&
      s.a.each(e.date_fields, (e, r) => {
        const a = t
          .find("input[name='" + r + "']")
          .filter(".datetime_field_enabled");
        if (a.length && a.data("invalid")) {
          n[r] || (n[r] = []);
          n[r].push(
            i["a"].t("errors.invalid_datetime", "Invalid date/time value")
          );
        }
      });
    e.numbers &&
      s.a.each(e.numbers, (e, t) => {
        const a = parseFloat(r[t]);
        if (isNaN(a)) {
          n[t] || (n[t] = []);
          n[t].push(
            i["a"].t("errors.invalid_number", "This should be a number.")
          );
        }
      });
    e.property_validations &&
      s.a.each(e.property_validations, (e, a) => {
        if (s.a.isFunction(a)) {
          let o = a.call(t, r[e], r);
          if (o) {
            "string" !== typeof o &&
              (o = i["a"].t(
                "errors.invalid_entry_for_field",
                "Invalid entry: %{field}",
                { field: e }
              ));
            n[e] || (n[e] = []);
            n[e].push(o);
          }
        }
      });
    let a = false;
    for (const e in n) {
      a = true;
      break;
    }
    if (a) {
      t.formErrors(n, e);
      Object(h["a"])(
        "Form Errors",
        this.attr("id") || this.attr("class") || document.title,
        JSON.stringify(n)
      );
      return false;
    }
    return true;
  };
  s.a.fn.validateForm.defaults = {
    object_name: null,
    required: null,
    dates: null,
    times: null,
  };
  s.a.fn.formErrors = function (e, t) {
    if (0 === this.length) return;
    const n = this;
    const r = {};
    const a = [];
    e && e.errors && (e = e.errors);
    "string" === typeof e && (e = { base: e });
    s.a.each(e, (e, t) => {
      if ("string" === typeof t) {
        var i = [];
        i.push(t);
        t = i;
      } else {
        if (
          "number" === typeof e &&
          2 == t.length &&
          t[0] instanceof jQuery &&
          "string" === typeof t[1]
        ) {
          a.push(t);
          return;
        }
        if (
          "number" === typeof e &&
          2 == t.length &&
          "string" === typeof t[1]
        ) {
          i = [];
          i.push(t[1]);
          e = t[0];
          t = i;
        } else
          try {
            i = [];
            for (const e in t)
              "object" === typeof t[e] && t[e].message
                ? i.push(t[e].message.toString())
                : i.push(t[e].toString());
            t = i;
          } catch (e) {
            t = t.toString();
          }
      }
      n.find(":input[name='" + e + "'],:input[name*='[" + e + "]']").length > 0
        ? s.a.each(t, (t, n) => {
            r[e]
              ? (r[e] += "<br/>" + Object(f["a"])(n))
              : (r[e] = Object(f["a"])(n));
          })
        : s.a.each(t, (e, t) => {
            r.general
              ? (r.general += "<br/>" + Object(f["a"])(t))
              : (r.general = Object(f["a"])(t));
          });
    });
    let i = false;
    let o = 0;
    let u = null;
    s()(document).scrollTop();
    const l = {};
    s()("#aria_alerts").empty();
    s.a.each(r, (e, t) => {
      let r = n
        .find(":input[name='" + e + "'],:input[name*='[" + e + "]']")
        .filter(":visible")
        .first();
      if (!r || 0 === r.length) {
        const t = n
          .find("[name='" + e + "'],[name*='[" + e + "]']")
          .filter(":not(:visible)")
          .first();
        t && t.length > 0 && (r = t.prev());
      }
      (r && 0 !== r.length && "general" != e) || (r = n);
      "TEXTAREA" == r[0].tagName &&
        r.next(".mceEditor").length &&
        (r = r.next().find(".mceIframeContainer"));
      l[e] = { object: r, message: t };
      i = true;
      const a = r.errorBox(s.a.raw(t)).offset();
      a.top > o && (o = a.top);
      u = r;
    });
    u && u.focus();
    for (let e = 0, t = a.length; e < t; e++) {
      const t = a[e][0];
      const n = a[e][1];
      i = true;
      const r = t.errorBox(n).offset();
      r.top > o && (o = r.top);
    }
    if (i) {
      t && t.onFormError && t.onFormError.call(n, l);
      s()("html,body").scrollTo({ top: o, left: 0 });
    }
    return this;
  };
  s.a.fn.errorBox = function (e, t, n) {
    if (this.length) {
      const r = this,
        a = r.data("associated_error_box");
      a && a.remove();
      let i = s()("#error_box_template");
      i.length ||
        (i = s()(
          "<div id='error_box_template' class='error_box errorBox' style=''><div class='error_text' style=''></div><img src='/images/error_bottom.png' class='error_bottom'/></div>"
        ).appendTo("body"));
      s.a.screenReaderFlashError(e);
      let o = i
        .clone(true)
        .attr("id", "")
        .css("zIndex", r.zIndex() + 1);
      n && (o = o.css("position", n));
      o.appendTo("body");
      o.find(".error_text").html(Object(f["a"])(e));
      const u = r.offset();
      const c = o.outerHeight();
      let d = Math.round(r.outerWidth() / 5);
      "FORM" == r[0].tagName && (d = Math.min(d, 50));
      o.hide()
        .css({ top: u.top - c + 2, left: u.left + d })
        .fadeIn("fast");
      const h = function () {
        const e = s()("#flash_screenreader_holder").find("span");
        const t = l.a.find(e, (e) => s()(e).text() == o.text());
        o.remove();
        t && s()(t).remove();
        r.removeData("associated_error_box");
        r.removeData("associated_error_object");
      };
      const m = function () {
        o.stop(true, true).fadeOut("slow", h);
      };
      r.data({ associated_error_box: o, associated_error_object: r })
        .click(m)
        .keypress(m);
      o.click(function () {
        s()(this).fadeOut("fast", h);
      });
      s.a.fn.errorBox.errorBoxes.push(r);
      s.a.fn.errorBox.isBeingAdjusted || s.a.moveErrorBoxes();
      t && s()("html,body").scrollTo(o);
      return o;
    }
  };
  s.a.fn.errorBox.errorBoxes = [];
  s.a.moveErrorBoxes = function () {
    const e = [];
    const t = s.a.fn.errorBox.errorBoxes;
    for (let n = 0; n < t.length; n++) {
      const r = t[n],
        a = r.data("associated_error_box");
      if (a && a.length && a[0].parentNode) {
        e.push(r);
        if (r.filter(":visible").length) {
          const e = r.offset();
          const t = a.outerHeight();
          let n = Math.round(r.outerWidth() / 5);
          "FORM" == r[0].tagName && (n = Math.min(n, 50));
          a.css({ top: e.top - t + 2, left: e.left + n }).show();
        } else a.hide();
      }
    }
    s.a.fn.errorBox.errorBoxes = e;
    e.length
      ? (s.a.fn.errorBox.isBeingAdjusted = setTimeout(s.a.moveErrorBoxes, 500))
      : delete s.a.fn.errorBox.isBeingAdjusted;
  };
  s.a.fn.hideErrors = function (e) {
    if (this.length) {
      const e = this.data("associated_error_box");
      const t = s()("#flash_screenreader_holder").find("span");
      if (e) {
        e.remove();
        this.data("associated_error_box", null);
      }
      this.find(":input").each(function () {
        const e = s()(this),
          n = e.data("associated_error_box");
        if (n) {
          n.remove();
          e.data("associated_error_box", null);
          const r = l.a.find(t, (e) => s()(e).text() == n.text());
          r && s()(r).remove();
        }
      });
    }
    return this;
  };
  s.a.fn.markRequired = function (e) {
    if (!e.required) return;
    let t = e.required;
    e.object_name && (t = s.a._addObjectName(t, e.object_name));
    const n = s()(this);
    s.a.each(t, function (e, t) {
      const r = n.find('[name="' + t + '"]');
      if (!r.length) return;
      r.attr({ "aria-required": "true" });
      r.each(function () {
        if (!this.id) return;
        const e = s()('label[for="' + this.id + '"]');
        if (!e.length) return;
        "pseudonym_session_unique_id_forgot" != this.id &&
          e.append(
            s()('<span aria-hidden="true" />')
              .text("*")
              .attr(
                "title",
                i["a"].t("errors.field_is_required", "This field is required")
              )
          );
      });
    });
  };
  s.a.fn.getFieldLabelString = function (e) {
    const t = s()(this).find('[name="' + e + '"]');
    if (!t.length || !t[0].id) return;
    const n = s()('label[for="' + t[0].id + '"]');
    if (!n.length) return;
    return n[0].firstChild.textContent;
  };
}
