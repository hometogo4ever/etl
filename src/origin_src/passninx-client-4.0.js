/**
 * ************************************************************************************************
 * 
 * C/S SSO 연동을 위해 필요한 스크립트 입니다.
 * 이 파일을 임의로 수정 후 발생한 오류에 대해서는 책임지지 않습니다.
 * 
 * 
 * 
 * 
 * 
 * 
 * ************************************************************************************************
 */

document.write( '<iframe src="about:blank" name="passninx_iframe" id="passninx_iframe" title="연동시스템 영역" style="width:0px; height:0px; visibility:hidden;"></iframe>' );
document.write( '<form name="passninx_form" id="passninx_form" method="post" action="">' );
document.write( '	<input type="hidden" name="tar_agt_id" />' );
document.write( '	<input type="hidden" name="pni_token" />' );
document.write( '	<input type="hidden" name="link_url" />' );
document.write( '</form>' );

/*
 * 연동시스템으로 SSO 실행
 */
function executeClientSSO( tar_agt_id, pni_token, server_url ) {
	
	var ssoForm = document.getElementById( 'passninx_form' );
	
	ssoForm.tar_agt_id.value = tar_agt_id;
	ssoForm.pni_token.value = pni_token;
	ssoForm.link_url.value = encodeURIComponent( window.location.href );
	
	ssoForm.action = server_url;
	ssoForm.target = 'passninx_iframe';
	ssoForm.submit();
}
