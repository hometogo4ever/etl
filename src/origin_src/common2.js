//language
$(".language > a").click(function () {
  $(".language > span").slideToggle(300);
});

//�� 2022_12_06
$(".tab_wrapper li a").click(function () {
  var tab_id = $(this).attr("data-tab");
  $(".tab_wrapper li a").removeClass("action");
  $(this).addClass("action");
  $(".join_wrap.border_box").hide();
  $("#b_" + tab_id).show();
});

//�쇰뵒�ㅻ쾭�� 泥댄겕
function setDisplay() {
  if ($("input:radio[id=radio3_01]").is(":checked")) {
    $(".select_wrap").fadeIn(100);
  } else {
    $(".select_wrap").fadeOut(100);
  }
}

//�앹뾽
$(document).ready(function () {
  var $this;

  $("[data-rel=pop]").click(function () {
    $this = $(this);
    $(".pop-wrap").hide();
    $("#dimmed").show();

    pop_w = $($(this).attr("href")).outerWidth();
    pop_h = $($(this).attr("href")).outerHeight();

    win_h = $(window).height();
    win_t = $(window).scrollTop();

    left_p = pop_w / 2;
    if (pop_h >= win_h) top_p = 0;
    else {
      top_p = win_h / 2 - pop_h / 2 + win_t;
    }

    $($(this).attr("href"))
      .fadeIn()
      .css({ "margin-left": -left_p, top: top_p });

    // �앹뾽李쎌쓣 �꾩슫 �� �ъ빱�� �대룞
    $($(this).attr("href")).attr("tabindex", 0).fadeIn().focus();
    return false;
  });

  $(".pop-close, #dimmed").click(function () {
    $("#dimmed, .pop-wrap").hide();

    // �앹뾽李쎌쓣 �レ� �� �ㅼ쓬 a�쒓렇濡� �대룞
    $this.closest("a").next().next().focus();
    return false;
  });
});

/*
	�ㅺ뎅�� Script
*/
function changeLang(language) {
  if (language == "eng") {
    $("#korBtn").attr("style", "display:none");
    $("#engBtn").attr("style", "display:block");
    $(".language > span").slideToggle(300);
    $("#contentDiv").html(html_en);
  } else {
    $("#korBtn").attr("style", "display:block");
    $("#engBtn").attr("style", "display:none");
    $(".language > span").slideToggle(300);
    $("#contentDiv").html(html_ko);
  }

  setCookie("snuSso.pageLang", language, "30");
  //alert('debug.. : '+ language );
  $("#page_lang").val(language);

  location.reload();
}

/*
	Cookie �ㅼ젙 愿���
*/
function setCookie(cookieName, value, exdays) {
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + exdays);
  var cookieValue =
    escape(value) + (exdays == null ? "" : "; expires=" + exdate.toGMTString());
  cookieValue = cookieValue + "; domain=snu.ac.kr; path=/sso";
  document.cookie = cookieName + "=" + cookieValue;
}

function deleteCookie(cookieName) {
  document.cookie =
    cookieName +
    "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/sso; domain=.snu.ac.kr";
}

function getCookie(cookieName) {
  cookieName = cookieName + "=";
  var cookieData = document.cookie;
  var start = cookieData.indexOf(cookieName);
  var cookieValue = "";
  if (start != -1) {
    start += cookieName.length;
    var end = cookieData.indexOf(";", start);
    if (end == -1) end = cookieData.length;
    cookieValue = cookieData.substring(start, end);
  }
  return unescape(cookieValue);
}

//�ㅺ뎅�� 諛� �꾩씠�� ���� �ㅼ젙 媛� Cookie �먯꽌 議고쉶
function languageSet() {
  var language = getCookie("snuSso.pageLang");

  if (language == "") {
    language =
      window.navigator.userLanguage != null
        ? window.navigator.userLanguage
        : window.navigator.language;
    language = language.toLowerCase() === "ko-kr" || "ko" ? "kor" : "eng";
  }

  if (language == "eng") {
    $("#korBtn").attr("style", "display:none");
    $("#engBtn").attr("style", "display:block");
    $("#contentDiv").html(html_en);
  } else {
    $("#korBtn").attr("style", "display:block");
    $("#engBtn").attr("style", "display:none");
    $("#contentDiv").html(html_ko);
  }
}

$(document).bind("keydown", function (e) {
  if (
    e.keyCode === 123 ||
    (e.ctrlKey && e.shiftKey && e.keyCode == 73) ||
    (e.ctrlKey && e.shiftKey && e.keyCode == 74) ||
    (e.ctrlKey && e.shiftKey && e.keyCode == 67)
  ) {
    e.preventDefault();
    e.returnValue = false;
  }
});

document.oncontextmenu = function () {
  return false;
};
document.onselectstart = function () {
  return false;
};
document.ondragstart = function () {
  return false;
};
