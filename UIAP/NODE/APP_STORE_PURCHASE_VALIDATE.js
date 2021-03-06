/*
 * 앱 스토어에서 이루어진 결제 정보를 검증합니다. 
 */
UIAP.APP_STORE_PURCHASE_VALIDATE = METHOD({
	
	run : (params, callback) => {
		//REQUIRED: params.productId
		//REQUIRED: params.receipt
		//REQUIRED: callback
		
		let productId = params.productId;
		let receipt = params.receipt;
		
		let f = RAR(() => {
			
			let host = 'buy.itunes.apple.com';
			
			RUN((retryToSandbox) => {
				
				let params;
				
				POST(params = {
					isSecure : true,
					host : host,
					uri : 'verifyReceipt',
					paramStr : JSON.stringify({
						'receipt-data' : receipt
					})
				}, {
					error : () => {
						f();
					},
					
					success : (content) => {
						
						let data = PARSE_STR(content);
						
						let isValid = false;
						
						if (data === undefined) {
							f();
						}
						
						else {
							
							if (data.status === 0 && data.receipt !== undefined) {
								
								// iOS <= 6
								if (data.receipt.product_id === productId) {
									isValid = true;
								}
								
								// iOS >= 7
								else if (data.receipt.in_app !== undefined) {
									EACH(data.receipt.in_app, (iapInfo) => {
										if (iapInfo.product_id === productId) {
											isValid = true;
											return false;
										}
									});
								}
							}
							
							if (isValid !== true && host !== 'sandbox.itunes.apple.com') {
								host = 'sandbox.itunes.apple.com';
								retryToSandbox();
							}
							
							else if (callback !== undefined) {
								callback(isValid);
							}
						}
					}
				});
			});
		});
	}
});
