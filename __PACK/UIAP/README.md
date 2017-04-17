# UIAP
인앱 결제 관련 기능들을 담은 UPPERCASE용 BOX입니다.

## 설치하기
1. 프로젝트의 `DEPENDENCY` 파일에 `Hanul/UIAP`를 추가합니다.
2. [`ubm`](https://www.npmjs.com/package/ubm)을 이용해 설치합니다.
	```
	ubm install
	```

## `APP_STORE_PURCHASE_VALIDATE`
앱 스토어에서 이루어진 결제 정보를 검증합니다.

### 사용방법
```javascript
UIAP.APP_STORE_PURCHASE_VALIDATE({
	productId : '{{productId}}',
	receipt : '{{receipt}}'
}, {
	error : (errorMsg) => {
		...
	},
	success : (isValid) => {
		console.log(isValid);
	}
});
```

## `GOOGLE_PLAY_PURCHASE_VALIDATE`
구글 플레이에서 이루어진 결제 정보를 검증합니다. 

### 사용 전 준비사항
1. Start off by going into the google play developer console as the main Administrator of the account (this role is the only one who is allowed to perform the following steps).
2. Go to "Settings->API Access" to link a Google Developer project to this account.
3. If you are new here choose "create new project".
4. You will now have more options. Choose "Create Service Account".
5. Follow the link to the Google Developer Console and your project
6. Click "Create new client id" to create a new client ID
7. Ignore the .p12 file that will be downloaded to your machine and instead click "generate new JSON key".
8. This will download a JSON file to your machine. We will get back to that file in a second.
9. Now go back to the play store publisher account and click "done". Your new generate user will appear here.
10. Click "grant access" and grant the user rights to read your project.
11. Now setup your Node.JS project with this module and provide the email-address and the private key found in the json file as options to this module.

### 설정
```javascript
require(process.env.UPPERCASE_PATH + '/LOAD.js');

BOOT({
	CONFIG : {
		...
	},

	NODE_CONFIG : {
	
		UIAP : {
			GooglePlay : {
				clientEmail : '~~~@~~~.iam.gserviceaccount.com',
				privateKey : '-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n',
				appPackageName : 'com.example.App'
			}
		},
		
		...
	}
});
```

### 사용방법
```javascript
UIAP.GOOGLE_PLAY_PURCHASE_VALIDATE({
	productId : '{{productId}}',
	purchaseToken : '{{purchaseToken}}'
}, {
	error : (errorMsg) => {
		...
	},
	success : (isValid) => {
		console.log(isValid);
	}
});
```

## API 문서
[API](API/README.md)

## 소스코드
https://github.com/Hanul/UIAP

## 라이센스
[MIT](LICENSE)

## 작성자
[Young Jae Sim](https://github.com/Hanul)