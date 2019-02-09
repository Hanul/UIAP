/*
 * 구글 플레이에서 이루어진 결제 정보를 검증합니다. 
 */
UIAP.GOOGLE_PLAY_PURCHASE_VALIDATE = METHOD((m) => {
	
	let url = 'https://www.googleapis.com/oauth2/v4/token';
	
	let URL = require('url');
	let Crypto = require('crypto');
	
	let urlData = URL.parse(url);
	
	return {
		
		run : (params, callbackOrHandlers) => {
			//REQUIRED: params
			//REQUIRED: params.productId
			//REQUIRED: params.purchaseToken
			//OPTIONAL: params.appPackageName
			//REQUIRED: callbackOrHandlers
			//OPTIONAL: callbackOrHandlers.error
			//OPTIONAL: callbackOrHandlers.success
			
			let productId = params.productId;
			let purchaseToken = params.purchaseToken;
			let appPackageName = params.appPackageName;
			
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
			
			let f = RAR(() => {
				
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
					}, {
						error : () => {
							f();
						},
						
						success : (content) => {
							
							let result = PARSE_STR(content);
							
							// 결과가 없으면 재시도
							if (result === undefined) {
								f();
							}
							
							else {
								next(result.access_token);
							}
						}
					});
				},
				
				() => {
					return (accessToken) => {
						
						GET({
							isSecure : true,
							host : 'www.googleapis.com',
							uri : 'androidpublisher/v2/applications/' + encodeURIComponent(appPackageName) + '/purchases/products/' + encodeURIComponent(productId) + '/tokens/' + encodeURIComponent(purchaseToken) + '?access_token=' + encodeURIComponent(accessToken)
						}, (json) => {
							
							let data = PARSE_STR(json);
							
							// 결과가 없으면 재시도
							if (data === undefined) {
								f();
							}
							
							else if (callback !== undefined) {
								
								if (data.error !== undefined) {
									callback(false);
								} else if (data.purchaseTimeMillis !== undefined) {
									callback(true);
								} else {
									callback(false);
								}
							}
						});
					};
				}]);
			});
		}
	};
});
