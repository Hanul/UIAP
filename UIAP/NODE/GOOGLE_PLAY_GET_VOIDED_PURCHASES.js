/*
 * 구글 플레이에서 이루어진 무효화된 결제 정보를 검증합니다.
 */
UIAP.GOOGLE_PLAY_GET_VOIDED_PURCHASES = METHOD((m) => {
	
	let url = 'https://www.googleapis.com/oauth2/v4/token';
	
	let URL = require('url');
	let Crypto = require('crypto');
	
	let urlData = URL.parse(url);
	
	return {
		
		run : (appPackageName, callbackOrHandlers) => {
			//OPTIONAL: appPackageName
			//REQUIRED: callbackOrHandlers
			//OPTIONAL: callbackOrHandlers.error
			//REQUIRED: callbackOrHandlers.success
			
			if (callbackOrHandlers === undefined) {
				callbackOrHandlers = appPackageName;
				appPackageName = undefined;
			}
			
			if (appPackageName === undefined) {
				appPackageName = NODE_CONFIG.UIAP.GooglePlay.appPackageName;
			}
			
			let errorHandler;
			let callback;
			
			if (callbackOrHandlers !== undefined) {
				
				if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
					callback = callbackOrHandlers;
				} else {
					errorHandler = callbackOrHandlers.error;
					callback = callbackOrHandlers.success;
				}
			}
			
			NEXT([
			(next) => {
				
				let iat = INTEGER(Date.now() / 1000);
				let exp = iat + INTEGER(60 * 60);
				
				let claims = {
					iss: NODE_CONFIG.UIAP.GooglePlay.clientEmail,
					scope: 'https://www.googleapis.com/auth/androidpublisher',
					aud: url,
					exp: exp,
					iat: iat
				};
				
				let jwt = Buffer.from(STRINGIFY({
					alg : 'RS256',
					typ : 'JWT'
				})).toString('base64') + '.' + Buffer.from(STRINGIFY(claims)).toString('base64');
	
				jwt += '.' + Crypto.createSign('RSA-SHA256').update(jwt).sign(NODE_CONFIG.UIAP.GooglePlay.privateKey, 'base64');
				
				POST({
					isSecure : urlData.protocol === 'https:',
					host : urlData.hostname === TO_DELETE ? undefined : urlData.hostname,
					port : urlData.port === TO_DELETE ? undefined : INTEGER(urlData.port),
					uri : urlData.pathname === TO_DELETE ? undefined : urlData.pathname.substring(1),
					paramStr : 'grant_type=' + encodeURIComponent('urn:ietf:params:oauth:grant-type:jwt-bearer') + '&assertion=' + encodeURIComponent(jwt),
					headers : {
						'Content-Type' : 'application/x-www-form-urlencoded'
					}
				}, (content) => {
					
					let result = PARSE_STR(content);
					
					if (result !== undefined) {
						next(result.access_token);
					}
				});
			},
			
			() => {
				return (accessToken) => {
					
					GET({
						isSecure : true,
						host : 'www.googleapis.com',
						uri : 'androidpublisher/v2/applications/' + encodeURIComponent(appPackageName) + '/purchases/voidedpurchases?access_token=' + encodeURIComponent(accessToken)
					}, (json) => {
						
						let data = PARSE_STR(json);
						
						if (data !== undefined && data.voidedPurchases !== undefined) {
							callback(data.voidedPurchases);
						}
					});
				};
			}]);
		}
	};
});
