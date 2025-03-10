
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=900" />
<title>Pass-Ni SSO Sample Page</title>
	
	<!--[if lt IE 9]>
	<script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
	<![endif]--> 
	
	<!--[if lt IE 7]>
	<script src="http://ie7-js.googlecode.com/svn/version/2.1(beta4)/IE8.js"></script>
	<![endif]--> 
	
	<!--[if lt IE 9]>
	<script src="http://ie7-js.googlecode.com/svn/version/2.1(beta4)/IE9.js"></script>
	<![endif]-->
	
	<!--[if lt IE 9]>
	<script src="http://css3-mediaqueries-js.googlecode.com/svn/trunk/css3-mediaqueries.js"></script>
	<![endif]-->
		
<link rel="stylesheet" type="text/css" href="css/default.css" />
<link rel="stylesheet" type="text/css" href="css/style.css" />

<script type="text/javascript" src="js/countdown.js"></script>
<script type="text/javascript" src="js/jquery-1.8.1.min.js"></script>
<script type="text/javascript" src="js/passninx-client-4.0.js"></script>

<script type="text/javascript">

	var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.RDg0RTc4NzhCOThEOEE1RkVGRDZCRTYwRjIwQkZCQTlFQjI0MTVDMTg4RkJCQzkxRjI5N0FGMkNEMTg4RDcxRTU2RkM0OEQ5NEU2MjdGNEI0MzkxNEQwQzdCODlEMDBCNThBREMxOTRBQzI3MDYzMDRERkIwQzRDNzM2NDU4NjZCRkU3REJCRUVCODk4MUM4RThCN0ZFNjVFMDgxMkFDQ0ZBMERCOTZBREZGNkIwQUVGRDYyQjU5NTFEMUY5MDQwQkZEMTI2RUE1NTRCQkFGNDRFRjk5M0VGMDQ3MTM2Q0Q2NkI5Mzg5M0UwOEY3RTE0Qjc0NDRDNDYxRkQ3MTVCNw.N0JEQUQzMUZCOUFGQkZBRDM1QTU4OEQ2MjZGMEMzRkJFOEY3NDQyN0E4OUJEOTQ1RjNCMjg3QjVEOEUyNDA3NA';

 	$(document).ready(function(){
		
 		if( token != '' ) {
 			
 			var policy = '{"atmc_logout_yn":"Y","atmc_logout_time":"30","login_dup_yn":"N"}';
 	 		if( policy != '' && policy != 'none' ) {
 	 			var objPolicy = JSON.parse( policy );
 	 			
 	 			var atmc_logout_yn = objPolicy.atmc_logout_yn;
 	 			var atmc_logout_time = objPolicy.atmc_logout_time;
 	 			var login_dup_yn = objPolicy.login_dup_yn;
 	 			
 	 			if( atmc_logout_yn == 'Y' ) {
 	 				fnAutoLogout( atmc_logout_time );
 	 			}

 	 			if( login_dup_yn == 'Y' ) {
 	 				fnLoginDupCheck();
 	 			}
 	 		}
 		}
	});

 	function fnAutoLogout( atmc_logout_time ) {
		$('#autologout').show();
			
		Countdown.start(atmc_logout_time, function() {
			procLogout();
			alert( '일정시간(' + atmc_logout_time + '분)동안 이용이 없어 자동로그아웃 되었습니다.' );
			location.href = '/passni/sso/spLogout.php';
		}, 'countdown');
	}

	function fnLoginDupCheck() {

		$.ajax({
			url: '/passni/sso/spUserCheck.php',
			type: 'post',
			data: '',
			dataType: 'text',
			async: false,
			success: function (responseData)
			{
				var data = responseData.trim();
				
				if( data != '' ) {
					procLogout();
					
					if( data == 'none' ) {
						alert( '로그아웃 되었습니다.' );
						
					} else {
						alert( '[' + data + '] IP에서 접속하여 로그아웃 되었습니다.' );
					}
					
					location.href = '/passni/sso/spLogout.php';
				}
			},
			error: function(xhr, error, thrown)
			{
				alert(xhr + '-' + error + '-' + thrown);
			}
		});
		
		return;
	}

	function procLogout() {
		$.ajax({
			url: '/passni/sso/spLogoutLog.php',
			type: 'post',
			async: false
		});
	}
	
	function fnLogin() {
		
		$('form[name=loginForm]').attr('action', '/passni/sso/spLogin.php').submit();
	}
	
	function fnLogout() {
		
		if( token != '' ) {
			if( confirm( '로그아웃 하시겠습니까?' ) ) {
				location.href = '/passni/sso/spLogout.php';
			}
		
		} else {
			alert( '로그인 이후 실행하여 주십시요.' );
		}
	}
	
	function fnSSO( url ) {
		
		if( token != '' ) {
			$('form[name=ssoForm]').attr('action', url).submit();
		
		} else {
			alert( '로그인 이후 실행하여 주십시요.' );
		}
	}

	function fnCSLogin( tar_agt_id, pni_token ) {
		
		executeClientSSO( tar_agt_id, pni_token, 'https://nsso.snu.ac.kr/sso/usr/client/login' );
	}

	function fnUserInfo() {
		
		location.href = 'userInfo.php';
	}
	
	function fnLoginCheck() {
		
		location.href = 'loginCheck.php';
	}
	
	function fnPolicyInfo() {
		
		location.href = 'policyInfo.php';
	}
	
	function fnAgentList() {
		
		location.href = 'agentList.php';
	}

	function fnPwdChange() {
		
		if( token != '' ) {
			var width = 800;
			var height = 490;
			
			var popid = window.open('', 'pop_change_pwd', 'width=' + width + ', height=' + height);
			
			$('#pname').val( 'loginAfter' );
			$('#link_type').val( 'pwChangePop' );
			
			$('form[name=selfPageForm]').attr('target', 'pop_change_pwd');
			$('form[name=selfPageForm]').attr('action', '/passni/sso/spSelfPage.php').submit();

			if ( popid )
			{
				popid.focus();
			}
		
		} else {
			alert( '로그인 이후 실행하여 주십시요.' );
		}
	}
	
</script>

</head>
<body>

	<form name="loginForm" id="loginForm" method="post" action="">
		<input type="hidden" name="param1" value="param1_value" />	<!-- 추가 파라미터가 있을 경우 -->
		<input type="hidden" name="param2" value="param2_value" />	<!-- 추가 파라미터가 있을 경우 -->
	</form>
	
	<form name="ssoForm" id="ssoForm" target="_blank" method="post" action="">
		<input type="hidden" name="pni_token" value="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.RDg0RTc4NzhCOThEOEE1RkVGRDZCRTYwRjIwQkZCQTlFQjI0MTVDMTg4RkJCQzkxRjI5N0FGMkNEMTg4RDcxRTU2RkM0OEQ5NEU2MjdGNEI0MzkxNEQwQzdCODlEMDBCNThBREMxOTRBQzI3MDYzMDRERkIwQzRDNzM2NDU4NjZCRkU3REJCRUVCODk4MUM4RThCN0ZFNjVFMDgxMkFDQ0ZBMERCOTZBREZGNkIwQUVGRDYyQjU5NTFEMUY5MDQwQkZEMTI2RUE1NTRCQkFGNDRFRjk5M0VGMDQ3MTM2Q0Q2NkI5Mzg5M0UwOEY3RTE0Qjc0NDRDNDYxRkQ3MTVCNw.N0JEQUQzMUZCOUFGQkZBRDM1QTU4OEQ2MjZGMEMzRkJFOEY3NDQyN0E4OUJEOTQ1RjNCMjg3QjVEOEUyNDA3NA" />	<!-- 토큰 -->
	</form>
	
	<form name="selfPageForm" id="selfPageForm" method="post" action="">
		<input type="hidden" name="pname" id="pname" />
		<input type="hidden" name="link_type" id="link_type" />
	</form>

	<div class="wrap">
		<h1>&nbsp; &nbsp; &nbsp;Pass-Ni SSO Sample Page ( 메인화면 )</h1>
		
		<div class="block0">
			<p><span class="tit">연동시스템 정보</span></p>
			<ul class="list-style">
				<li>
					<span class="tit color">Agent 도메인 </span><span class="cont">&nbsp;&nbsp;etl.snu.ac.kr</span>
					&nbsp; &nbsp; &nbsp; &nbsp;
					<span class="tit color">Agent 아이디 </span><span class="cont">&nbsp;&nbsp; snu-ctl</span>
				</li>
			</ul>
		</div>
		<div class="bg-section">
			<div class="block1">
				<p><span class="tit">사용자 정보</span></p>
				<ul class="list-style">
					<li><span class="tit color">인증 토큰<br/></span><span class="cont">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.RDg0RTc4NzhCOThEOEE1RkVGRDZCRTYwRjIwQkZCQTlFQjI0MTVDMTg4RkJCQzkxRjI5N0FGMkNEMTg4RDcxRTU2RkM0OEQ5NEU2MjdGNEI0MzkxNEQwQzdCODlEMDBCNThBREMxOTRBQzI3MDYzMDRERkIwQzRDNzM2NDU4NjZCRkU3REJCRUVCODk4MUM4RThCN0ZFNjVFMDgxMkFDQ0ZBMERCOTZBREZGNkIwQUVGRDYyQjU5NTFEMUY5MDQwQkZEMTI2RUE1NTRCQkFGNDRFRjk5M0VGMDQ3MTM2Q0Q2NkI5Mzg5M0UwOEY3RTE0Qjc0NDRDNDYxRkQ3MTVCNw.N0JEQUQzMUZCOUFGQkZBRDM1QTU4OEQ2MjZGMEMzRkJFOEY3NDQyN0E4OUJEOTQ1RjNCMjg3QjVEOEUyNDA3NA</span></li>
					<li><span class="tit color">사용자 정보<br/></span><span class="cont">{"uid":"hometogo0625","name":"곽민서","groupcd":"N","pot_state_cd":"","pot_use_at":"","pot_order":"","snu_member_key":"2023-15725","rpst_pers_no":"2023-15725","foreignyn":"N","birthday":"20040625","mobile":"010-9309-5295","mail":"hometogo0625@snu.ac.kr","outsid_email":"sessy0625@naver.com","idms_user_st_cd":"1","gr1memberkey":"2023-15725","gr1groupcd":"S","gr1statecd":"1","gr1suporgcd":"400","gr1suborgcd":"4190","gr1suporgname":"공과대학","gr1suborgname":"컴퓨터공학부","gr1engsuporgname":"College of Engineering","gr1engsuborgname":"Department of Computer Science and Engineering","gr2memberkey":null,"gr2groupcd":null,"gr2statecd":null,"gr2suporgcd":null,"gr2suborgcd":null,"gr2suporgname":null,"gr2suborgname":null,"gr2engsuporgname":null,"gr2engsuborgname":null,"gr3memberkey":null,"gr3groupcd":null,"gr3statecd":null,"gr3suporgcd":null,"gr3suborgcd":null,"gr3suporgname":null,"gr3suborgname":null,"gr3engsuporgname":null,"gr3engsuborgname":null,"gr4memberkey":null,"gr4groupcd":null,"gr4statecd":null,"gr4suporgcd":null,"gr4suborgcd":null,"gr4suporgname":null,"gr4suborgname":null,"gr4engsuporgname":null,"gr4engsuborgname":null,"gr5memberkey":null,"gr5groupcd":null,"gr5statecd":null,"gr5suporgcd":null,"gr5suborgcd":null,"gr5suporgname":null,"gr5suborgname":null,"gr5engsuporgname":null,"gr5engsuborgname":null,"std_fg":"U030500001","camp_fg":"1","statedtlcd":"1","noti_at":"N","use_at":"Y","user_state":"US01","updt_de":null,"updusr_id":null,"updusr_nm":null,"regist_de":"2023-02-06 15:53:01","register_id":"hometogo0625","register_nm":"곽민서","pni_login_type":"L002"}</span></li>
					<li id="autologout" style="display:none;"><span class="tit color">자동 로그아웃<br/></span><span class="cont" id="countdown"></span></li>
				</ul>
			</div>
		</div>
		
		<div class="block3">
		
				
			<div class="title">
				<h2>링크 예제</h2>
				<p class="line"></p>
				<p class="cont">( 통합 로그아웃, 사용자 정보 조회(API), 로그인 체크(API), 연동시스템 조회(API), 비밀번호 변경 )</p>
			</div>
			
			<div style="height:160px;">
			
				<ul class="icon-bt first-child">
					<li><a href="javascript:fnLogout();"><img src="img/bt-2.jpg" alt="통합 로그아웃" /></a></li>
					<li class="tit"><a href="javascript:fnLogout();">통합 로그아웃</a></li>
					<li class="cont">연동된 모든 시스템 로그아웃</li>
				</ul>
				
				<ul class="icon-bt">
					<li><a href="javascript:fnUserInfo();"><img src="img/bt-2.jpg" alt="사용자 정보 조회" /></a></li>
					<li class="tit"><a href="javascript:fnUserInfo();">사용자 정보 조회</a></li>
					<li class="cont">사용자 정보 조회(API)</li>
				</ul>
				
				<ul class="icon-bt">
					<li><a href="javascript:fnLoginCheck();"><img src="img/bt-2.jpg" alt="로그인 체크" /></a></li>
					<li class="tit"><a href="javascript:fnLoginCheck();">로그인 체크</a></li>
					<li class="cont">토튼 유효, 중복로그인 등 체크(API)</li>
				</ul>
				
				<ul class="icon-bt">
					<li><a href="javascript:fnAgentList();"><img src="img/bt-2.jpg" alt="연동시스템 조회" /></a></li>
					<li class="tit"><a href="javascript:fnAgentList();">연동시스템 조회</a></li>
					<li class="cont">연동시스템 조회(API)</li>
				</ul>
			
			</div>
			
			<div style="height:200px;">
				
				<ul class="icon-bt first-child">
					<li><a href="javascript:fnPwdChange();"><img src="img/bt-2.jpg" alt="비밀번호 변경" /></a></li>
					<li class="tit"><a href="javascript:fnPwdChange();">비밀번호 변경</a></li>
					<li class="cont">비밀번호 변경 화면</li>
				</ul>
				
			</div>
			
		        	
        	<div class="title">
				<h2>연동시스템 링크</h2>
				<p class="line"></p>
			</div>
        	
        				<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://scard1.snu.ac.kr/passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://scard1.snu.ac.kr/passni/sample/loginProc.jsp' );">S-CARD(andwise)(snu-andwise)</a></li>
					<li class="cont">S-CARD(andwise)으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://archives.snu.ac.kr/DAS/DAS/passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://archives.snu.ac.kr/DAS/DAS/passni/sample/loginProc.jsp' );">기록관(snu-archives)</a></li>
					<li class="cont">기록관으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( '//passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( '//passni/sample/loginProc.jsp' );">연구성과관리시스템(AS-RIMS)(snu-asrims)</a></li>
					<li class="cont">연구성과관리시스템(AS-RIMS)으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://aua.snu.ac.kr/passni/sample/loginProc.php' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://aua.snu.ac.kr/passni/sample/loginProc.php' );">대학행정교육원(snu-aua)</a></li>
					<li class="cont">대학행정교육원으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://bis.snu.ac.kr/passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://bis.snu.ac.kr/passni/sample/loginProc.jsp' );">통계정보(snu-bis)</a></li>
					<li class="cont">통계정보으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://biz.snu.ac.kr/passni/sample/loginProc.php' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://biz.snu.ac.kr/passni/sample/loginProc.php' );">경영대학(snu-biz)</a></li>
					<li class="cont">경영대학으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://board.snu.ac.kr/index.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://board.snu.ac.kr/index.jsp' );">게시판(snu-board)</a></li>
					<li class="cont">게시판으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'http://book.snu.ac.kr/passni/sample/loginProc.php' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'http://book.snu.ac.kr/passni/sample/loginProc.php' );">중앙도서관 빅데이터(책)(snu-book)</a></li>
					<li class="cont">중앙도서관 빅데이터(책)으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://cals.snu.ac.kr/passni/sample/loginProc.php' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://cals.snu.ac.kr/passni/sample/loginProc.php' );">농생대(snu-cals)</a></li>
					<li class="cont">농생대으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( '//passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( '//passni/sample/loginProc.jsp' );">캠퍼스맵(snu-campusmap)</a></li>
					<li class="cont">캠퍼스맵으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://chatbot.snu.ac.kr/passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://chatbot.snu.ac.kr/passni/sample/loginProc.jsp' );">챗봇(snu-chatbot)</a></li>
					<li class="cont">챗봇으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://convergence.snu.ac.kr/passni/sample/loginProc.php' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://convergence.snu.ac.kr/passni/sample/loginProc.php' );">융합과학기술대학원(snu-convergence)</a></li>
					<li class="cont">융합과학기술대학원으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://cpr.snu.ac.kr/passni/sample/loginProc.asp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://cpr.snu.ac.kr/passni/sample/loginProc.asp' );">보건진료소 CPR(snu-cpr)</a></li>
					<li class="cont">보건진료소 CPR으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://dcollection.snu.ac.kr/passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://dcollection.snu.ac.kr/passni/sample/loginProc.jsp' );">dcollection(snu-dcoll)</a></li>
					<li class="cont">dcollection으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://dell.snu.ac.kr:9443/agent/passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://dell.snu.ac.kr:9443/agent/passni/sample/loginProc.jsp' );">Dell 시스템(snu-dell)</a></li>
					<li class="cont">Dell 시스템으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://dentistry.snu.ac.kr/passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://dentistry.snu.ac.kr/passni/sample/loginProc.jsp' );">치의학대학원 통합홈페이지(snu-dentistry)</a></li>
					<li class="cont">치의학대학원 통합홈페이지으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://diversity.snu.ac.kr/passni/sample/loginProc.php' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://diversity.snu.ac.kr/passni/sample/loginProc.php' );">다양성 위원회(snu-diversity)</a></li>
					<li class="cont">다양성 위원회으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( '//passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( '//passni/sample/loginProc.jsp' );">erp3rd eaccount(snu-eaccount)</a></li>
					<li class="cont">erp3rd eaccount으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://scard1.snu.ac.kr/eams/eams/passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://scard1.snu.ac.kr/eams/eams/passni/sample/loginProc.jsp' );">SCARD(eams)(snu-eams)</a></li>
					<li class="cont">SCARD(eams)으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://ece.snu.ac.kr/passni/sample/loginProc.php' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://ece.snu.ac.kr/passni/sample/loginProc.php' );">전기정보공학부(snu-ece)</a></li>
					<li class="cont">전기정보공학부으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'http://222.122.110.161/passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'http://222.122.110.161/passni/sample/loginProc.jsp' );">공과대학홈페이지(snu-eng)</a></li>
					<li class="cont">공과대학홈페이지으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://test.snu.ac.kr/agt/passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://test.snu.ac.kr/agt/passni/sample/loginProc.jsp' );">ERP-EP(snu-ep)</a></li>
					<li class="cont">ERP-EP으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://s-erp.snu.ac.kr/sso-agent/passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://s-erp.snu.ac.kr/sso-agent/passni/sample/loginProc.jsp' );">ERP-EP(snu-epdap)</a></li>
					<li class="cont">ERP-EP으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://extra.snu.ac.kr/passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://extra.snu.ac.kr/passni/sample/loginProc.jsp' );">비교과(snu-extra)</a></li>
					<li class="cont">비교과으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://scard1.snu.ac.kr/gat/gat/passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://scard1.snu.ac.kr/gat/gat/passni/sample/loginProc.jsp' );">S-CARD(gat)(snu-gat)</a></li>
					<li class="cont">S-CARD(gat)으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( '//' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( '//' );">스누지니관리자(snu-genieadmin)</a></li>
					<li class="cont">스누지니관리자으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( '//' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( '//' );">스누지니웹(snu-genieweb)</a></li>
					<li class="cont">스누지니웹으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://girok.snu.ac.kr/passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://girok.snu.ac.kr/passni/sample/loginProc.jsp' );">기록관(snu-girok)</a></li>
					<li class="cont">기록관으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://gspagosi.snu.ac.kr/passni/sample/loginProc.asp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://gspagosi.snu.ac.kr/passni/sample/loginProc.asp' );">행정대학원 서연재(snu-gspagosi)</a></li>
					<li class="cont">행정대학원 서연재으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://gums.snu.ac.kr/agt/passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://gums.snu.ac.kr/agt/passni/sample/loginProc.jsp' );">gums(snu-gums)</a></li>
					<li class="cont">gums으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( '//passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( '//passni/sample/loginProc.jsp' );">전자결재 운영(snu-gw)</a></li>
					<li class="cont">전자결재 운영으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( '//sso/passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( '//sso/passni/sample/loginProc.jsp' );">전자결재 모바일(snu-gw-mob)</a></li>
					<li class="cont">전자결재 모바일으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://health4u.snu.ac.kr/passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://health4u.snu.ac.kr/passni/sample/loginProc.jsp' );">보건진료소(snu-health4u)</a></li>
					<li class="cont">보건진료소으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://helplms.snu.ac.kr/passni/sample/loginProc.php' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://helplms.snu.ac.kr/passni/sample/loginProc.php' );">인권센터(snu-helplms)</a></li>
					<li class="cont">인권센터으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://hjtic.snu.ac.kr/passni/sample/loginProc.php' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://hjtic.snu.ac.kr/passni/sample/loginProc.php' );">해동일본기술정보센터(snu-hjtic)</a></li>
					<li class="cont">해동일본기술정보센터으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://www.snu.ac.kr/passni/sample/loginProc.php' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://www.snu.ac.kr/passni/sample/loginProc.php' );">대표홈페이지(snu-home)</a></li>
					<li class="cont">대표홈페이지으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://hosting01.snu.ac.kr/passni/sample/loginProc.php' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://hosting01.snu.ac.kr/passni/sample/loginProc.php' );">호스팅01(snu-hosting01)</a></li>
					<li class="cont">호스팅01으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://hosting02.snu.ac.kr/passni/sample/loginProc.php' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://hosting02.snu.ac.kr/passni/sample/loginProc.php' );">호스팅02(snu-hosting02)</a></li>
					<li class="cont">호스팅02으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://hosting03.snu.ac.kr/passni/sample/loginProc.php' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://hosting03.snu.ac.kr/passni/sample/loginProc.php' );">호스팅03(snu-hosting03)</a></li>
					<li class="cont">호스팅03으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://hosting04.snu.ac.kr/passni/sample/loginProc.php' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://hosting04.snu.ac.kr/passni/sample/loginProc.php' );">호스팅04(snu-hosting04)</a></li>
					<li class="cont">호스팅04으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://hosting05.snu.ac.kr/passni/sample/loginProc.php' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://hosting05.snu.ac.kr/passni/sample/loginProc.php' );">호스팅05(snu-hosting05)</a></li>
					<li class="cont">호스팅05으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://hosting11.snu.ac.kr/passni/sample/loginProc.asp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://hosting11.snu.ac.kr/passni/sample/loginProc.asp' );">호스팅11(snu-hosting11)</a></li>
					<li class="cont">호스팅11으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://hosting12.snu.ac.kr/passni/sample/loginProc.asp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://hosting12.snu.ac.kr/passni/sample/loginProc.asp' );">호스팅12(snu-hosting12)</a></li>
					<li class="cont">호스팅12으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://scard1.snu.ac.kr/idt/idt/passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://scard1.snu.ac.kr/idt/idt/passni/sample/loginProc.jsp' );">S-CARD(idt)(snu-idt)</a></li>
					<li class="cont">S-CARD(idt)으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'http://ilaw.snu.ac.kr/passni/sample/loginProc.php' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'http://ilaw.snu.ac.kr/passni/sample/loginProc.php' );">법대인트라넷(snu-ilaw)</a></li>
					<li class="cont">법대인트라넷으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'http://itsm.snu.ac.kr/passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'http://itsm.snu.ac.kr/passni/sample/loginProc.jsp' );">ITSM(snu-itsm)</a></li>
					<li class="cont">ITSM으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://kafegw.snu.ac.kr/simplesaml/passni/sample/loginProc.php' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://kafegw.snu.ac.kr/simplesaml/passni/sample/loginProc.php' );">KAFE(snu-kafegw)</a></li>
					<li class="cont">KAFE으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://k-rsv.snu.ac.kr:8011/NEW_SNU_BOOKING/NEW_SNU_BOOKING/passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://k-rsv.snu.ac.kr:8011/NEW_SNU_BOOKING/NEW_SNU_BOOKING/passni/sample/loginProc.jsp' );">중앙도서관 시설예약(snu-krsv)</a></li>
					<li class="cont">중앙도서관 시설예약으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( '//' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( '//' );">LARIS(snu-laris)</a></li>
					<li class="cont">LARIS으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://law.snu.ac.kr/passni/sample/loginProc.php' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://law.snu.ac.kr/passni/sample/loginProc.php' );">법학전문대학원(snu-law)</a></li>
					<li class="cont">법학전문대학원으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://lawcfs.snu.ac.kr/passni/sample/loginProc.php' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://lawcfs.snu.ac.kr/passni/sample/loginProc.php' );">학문후속세대양성센터(snu-lawcfs)</a></li>
					<li class="cont">학문후속세대양성센터으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( '//passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( '//passni/sample/loginProc.jsp' );">대량메일(snu-letter2)</a></li>
					<li class="cont">대량메일으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://lib.snu.ac.kr/passni/sample/loginProc.php' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://lib.snu.ac.kr/passni/sample/loginProc.php' );">중앙도서관 홈페이지(snu-lib)</a></li>
					<li class="cont">중앙도서관 홈페이지으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://likesnu.snu.ac.kr/passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://likesnu.snu.ac.kr/passni/sample/loginProc.jsp' );">중앙도서관 빅데이터(snu-likesnu)</a></li>
					<li class="cont">중앙도서관 빅데이터으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://idt.snu.ac.kr/watchLogApi/passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://idt.snu.ac.kr/watchLogApi/passni/sample/loginProc.jsp' );">Scard(LogAPI)(snu-logapi)</a></li>
					<li class="cont">Scard(LogAPI)으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'http://meddorm.snu.ac.kr/passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'http://meddorm.snu.ac.kr/passni/sample/loginProc.jsp' );">연건기숙사(snu-meddorm)</a></li>
					<li class="cont">연건기숙사으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://medicine.snu.ac.kr/passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://medicine.snu.ac.kr/passni/sample/loginProc.jsp' );">의과대학(snu-medicine)</a></li>
					<li class="cont">의과대학으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://medlib.snu.ac.kr/passni/sample/loginProc.php' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://medlib.snu.ac.kr/passni/sample/loginProc.php' );">의학도서관(snu-medlib)</a></li>
					<li class="cont">의학도서관으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://mentoring.snu.ac.kr/passni/sample/loginProc.php' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://mentoring.snu.ac.kr/passni/sample/loginProc.php' );">경력개발(snu-mentoring)</a></li>
					<li class="cont">경력개발으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( '/snu/snu/passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( '/snu/snu/passni/sample/loginProc.jsp' );">모바일관리자운영(snu-mobadm)</a></li>
					<li class="cont">모바일관리자운영으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://mob.snu.ac.kr/mob/login/newLogin.html?afterSSO=/mob/main/main.html&amp;changePwd=Y/api/passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://mob.snu.ac.kr/mob/login/newLogin.html?afterSSO=/mob/main/main.html&amp;changePwd=Y/api/passni/sample/loginProc.jsp' );">모바일서비스운영(snu-mobapi)</a></li>
					<li class="cont">모바일서비스운영으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'http://147.47.106.125/passni/sample/loginProc.php' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'http://147.47.106.125/passni/sample/loginProc.php' );">음악대학(snu-music)</a></li>
					<li class="cont">음악대학으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://mylearn.snu.ac.kr/passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://mylearn.snu.ac.kr/passni/sample/loginProc.jsp' );">myLearn(snu-mylearn)</a></li>
					<li class="cont">myLearn으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://myteaching.snu.ac.kr/passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://myteaching.snu.ac.kr/passni/sample/loginProc.jsp' );">myTeaching(snu-myteaching)</a></li>
					<li class="cont">myTeaching으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://mo.snu.ac.kr/passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://mo.snu.ac.kr/passni/sample/loginProc.jsp' );">신규 포털 모바일(snu-new-mobapi)</a></li>
					<li class="cont">신규 포털 모바일으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://tmp.my.snu.ac.kr/passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://tmp.my.snu.ac.kr/passni/sample/loginProc.jsp' );">신규 포털(snu-new-portal)</a></li>
					<li class="cont">신규 포털으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://tmpsearch.snu.ac.kr/passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://tmpsearch.snu.ac.kr/passni/sample/loginProc.jsp' );">신규 포털 검색(snu-new-search)</a></li>
					<li class="cont">신규 포털 검색으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://tmpsnucmsit.snu.ac.kr/passni/sample/loginProc.php' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://tmpsnucmsit.snu.ac.kr/passni/sample/loginProc.php' );">신규 스누CMS(snu-new-snucms)</a></li>
					<li class="cont">신규 스누CMS으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://147.46.79.178:18001/passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://147.46.79.178:18001/passni/sample/loginProc.jsp' );">신규 웹 취약점 점검(snu-new-wscan)</a></li>
					<li class="cont">신규 웹 취약점 점검으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( '//passni/sample/loginProc.php' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( '//passni/sample/loginProc.php' );">agent test(snu-nssotest)</a></li>
					<li class="cont">agent test으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://shine.snu.ac.kr/com/passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://shine.snu.ac.kr/com/passni/sample/loginProc.jsp' );">행정정보시스템(snu-nuis)</a></li>
					<li class="cont">행정정보시스템으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://oia.snu.ac.kr/passni/sample/loginProc.php' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://oia.snu.ac.kr/passni/sample/loginProc.php' );">국제협력본부 OIA(snu-oia)</a></li>
					<li class="cont">국제협력본부 OIA으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://oldetl.snu.ac.kr/passni/sample/loginProc.php' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://oldetl.snu.ac.kr/passni/sample/loginProc.php' );">ETL(구)(snu-oldetl)</a></li>
					<li class="cont">ETL(구)으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://place.snu.ac.kr/passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://place.snu.ac.kr/passni/sample/loginProc.jsp' );">주차관제시스템(snu-place)</a></li>
					<li class="cont">주차관제시스템으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( '//' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( '//' );">포털(MySNU)(snu-portal)</a></li>
					<li class="cont">포털(MySNU)으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://probono.snu.ac.kr/passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://probono.snu.ac.kr/passni/sample/loginProc.jsp' );">공익법률센터(snu-probono)</a></li>
					<li class="cont">공익법률센터으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( '//passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( '//passni/sample/loginProc.jsp' );">erp3rd procure(snu-procure)</a></li>
					<li class="cont">erp3rd procure으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://pscan.snu.ac.kr/cpms/passni/sample/loginProc.php' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://pscan.snu.ac.kr/cpms/passni/sample/loginProc.php' );">개인정보 노출점검(snu-pscan)</a></li>
					<li class="cont">개인정보 노출점검으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://pyeongchang.snu.ac.kr/passni/sample/loginProc.asp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://pyeongchang.snu.ac.kr/passni/sample/loginProc.asp' );">평창캠퍼스 홈페이지(snu-pyeongchang)</a></li>
					<li class="cont">평창캠퍼스 홈페이지으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'itsc.snu.ac.kr:50080/passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'itsc.snu.ac.kr:50080/passni/sample/loginProc.jsp' );">대여관리시스템(snu-rental)</a></li>
					<li class="cont">대여관리시스템으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://snurnd.snu.ac.kr/passni/sample/loginProc.php' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://snurnd.snu.ac.kr/passni/sample/loginProc.php' );">산학협력단(snu-rnd)</a></li>
					<li class="cont">산학협력단으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( '//' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( '//' );">연구안전SAFE(snu-rsis)</a></li>
					<li class="cont">연구안전SAFE으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'http://rsurvey1.snu.ac.kr:8080/passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'http://rsurvey1.snu.ac.kr:8080/passni/sample/loginProc.jsp' );">설문조사(신규)(snu-rsurvey1)</a></li>
					<li class="cont">설문조사(신규)으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( '//passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( '//passni/sample/loginProc.jsp' );">검색운영(snu-search)</a></li>
					<li class="cont">검색운영으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://senate.snu.ac.kr/passni/sample/loginProc.php' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://senate.snu.ac.kr/passni/sample/loginProc.php' );">평의원회(snu-senate)</a></li>
					<li class="cont">평의원회으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( '//passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( '//passni/sample/loginProc.jsp' );">SFIMS(snu-sfims)</a></li>
					<li class="cont">SFIMS으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( '//passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( '//passni/sample/loginProc.jsp' );">공간관리(snu-sims)</a></li>
					<li class="cont">공간관리으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://snucms.snu.ac.kr/passni/sample/loginProc.php' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://snucms.snu.ac.kr/passni/sample/loginProc.php' );">스누CMS(snu-snucms)</a></li>
					<li class="cont">스누CMS으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://snucounsel.snu.ac.kr/passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://snucounsel.snu.ac.kr/passni/sample/loginProc.jsp' );">대학생활문화원(snu-snucounsel)</a></li>
					<li class="cont">대학생활문화원으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://snuf.snu.ac.kr/passni/sample/loginProc.aspx' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://snuf.snu.ac.kr/passni/sample/loginProc.aspx' );">발전기금 회계관리시스템(snu-snuf)</a></li>
					<li class="cont">발전기금 회계관리시스템으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://snugle-i.snu.ac.kr/passni/sample/loginProc.php' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://snugle-i.snu.ac.kr/passni/sample/loginProc.php' );">국제협력본부 GLE(snu-snugle)</a></li>
					<li class="cont">국제협력본부 GLE으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( '//sso/sso.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( '//sso/sso.jsp' );">SNULINK(snu-snulink)</a></li>
					<li class="cont">SNULINK으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://snupal.snu.ac.kr/passni/sample/loginProc.php' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://snupal.snu.ac.kr/passni/sample/loginProc.php' );">스누팔(snu-snupal)</a></li>
					<li class="cont">스누팔으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( '/agt/agt/passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( '/agt/agt/passni/sample/loginProc.jsp' );">testsite(snu-snustay)</a></li>
					<li class="cont">testsite으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://s-rims.snu.ac.kr/passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://s-rims.snu.ac.kr/passni/sample/loginProc.jsp' );">연구성과관리시스템(S-RIMS)(snu-srims)</a></li>
					<li class="cont">연구성과관리시스템(S-RIMS)으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://srnd.snu.ac.kr/srf/srf/passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://srnd.snu.ac.kr/srf/srf/passni/sample/loginProc.jsp' );">SRnD(snu-srnd)</a></li>
					<li class="cont">SRnD으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://sslib.snu.ac.kr/passni/sample/loginProc.php' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://sslib.snu.ac.kr/passni/sample/loginProc.php' );">사회대도서관(snu-sslib)</a></li>
					<li class="cont">사회대도서관으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://ssoagent.snu.ac.kr/agent/agent/passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://ssoagent.snu.ac.kr/agent/agent/passni/sample/loginProc.jsp' );">운영Agent(snu-ssoagent)</a></li>
					<li class="cont">운영Agent으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( '//passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( '//passni/sample/loginProc.jsp' );">S-SPACE(snu-sspace)</a></li>
					<li class="cont">S-SPACE으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://sugang.snu.ac.kr/passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://sugang.snu.ac.kr/passni/sample/loginProc.jsp' );">수강신청(snu-sugang)</a></li>
					<li class="cont">수강신청으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( '//sso_login.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( '//sso_login.jsp' );">설문조사(snu-survey1)</a></li>
					<li class="cont">설문조사으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://teacher.snu.ac.kr/passni/sample/loginProc.php' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://teacher.snu.ac.kr/passni/sample/loginProc.php' );">교원양성지원센터(snu-teacher)</a></li>
					<li class="cont">교원양성지원센터으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( '//passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( '//passni/sample/loginProc.jsp' );">SNU webmail(snu-webmail)</a></li>
					<li class="cont">SNU webmail으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://wellbeing4u.snu.ac.kr/passni/sample/loginProc.asp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://wellbeing4u.snu.ac.kr/passni/sample/loginProc.asp' );">보건진료소 정신건강(snu-wellbeing4u)</a></li>
					<li class="cont">보건진료소 정신건강으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://old_wscan.snu.ac.kr/UVMU/passni/sample/loginProc.aspx' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://old_wscan.snu.ac.kr/UVMU/passni/sample/loginProc.aspx' );">웹취약점 점검(snu-wscan)</a></li>
					<li class="cont">웹취약점 점검으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'http://147.47.106.219/passni/sample/loginProc.php' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'http://147.47.106.219/passni/sample/loginProc.php' );">연건학생지원센터(snu-yss)</a></li>
					<li class="cont">연건학생지원센터으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'test/agt/passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'test/agt/passni/sample/loginProc.jsp' );">테스트(test)</a></li>
					<li class="cont">테스트으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://mob.snu.ac.kr/mob/login/newLogin.html?afterSSO=/mob/main/main.html&amp;changePwd=Y/agt/passni/sample/loginProc.jsp' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://mob.snu.ac.kr/mob/login/newLogin.html?afterSSO=/mob/main/main.html&amp;changePwd=Y/agt/passni/sample/loginProc.jsp' );">test2(test2)</a></li>
					<li class="cont">test2으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://www.bizplay.co.kr/sso/saml2/snu/login' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://www.bizplay.co.kr/sso/saml2/snu/login' );">BizPlay(https://www.bizplay.co.kr/sso/saml2/snu)</a></li>
					<li class="cont">BizPlay으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://shadreammall.com/saml2/shadream/index.do' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://shadreammall.com/saml2/shadream/index.do' );">샤드림(SAML)(snu-shadream)</a></li>
					<li class="cont">샤드림(SAML)으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://snu.gov-dooray.com/auth/signin' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://snu.gov-dooray.com/auth/signin' );">두레이(snu)</a></li>
					<li class="cont">두레이으로 SSO 연동<br/><br/><br/></li>
				</ul>
						<ul class="icon-bt">
					<li><a href="javascript:fnSSO( 'https://nsso.snu.ac.kr' );"><img src="img/bt-2.jpg" alt="SSO 연동" /></a></li>
					<li class="tit"><a href="javascript:fnSSO( 'https://nsso.snu.ac.kr' );">ZOOM(snu-ac-kr.zoom.us)</a></li>
					<li class="cont">ZOOM으로 SSO 연동<br/><br/><br/></li>
				</ul>
				
		</div>
		
	</div>

</body>
</html>
