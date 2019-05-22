# UIAP
인앱 결제 관련 기능들을 담은 UPPERCASE용 BOX입니다.

## 설치하기
프로젝트의 `DEPENDENCY` 파일에 `Hanul/UIAP`를 추가합니다.

## `APP_STORE_PURCHASE_VALIDATE`
앱 스토어에서 이루어진 결제 정보를 검증합니다.

### 사용방법
```javascript
UIAP.APP_STORE_PURCHASE_VALIDATE({
	productId : '{{productId}}',
	receipt : '{{receipt}}'
}, (isValid) => {
	console.log(isValid);
});
```

## `GOOGLE_PLAY_PURCHASE_VALIDATE`
구글 플레이에서 이루어진 결제 정보를 검증합니다. 

### 사용 전 준비사항
※ 한번 설정하면 모든 구글 플레이 프로젝트에서 사용할 수 있습니다.

1. 구글 플레이 콘솔에 관리자 계정으로 로그인합니다.
2. `설정 - API 액세스`로 이동합니다. (서비스 약관이 뜨면, 수락합니다.)
3. `새 프로젝트 만들기`를 누릅니다.
4. 하단의 `서비스 계정 만들기`를 누릅니다.
5. Google API 콘솔로 이동합니다.
6. `서비스 계정 만들기`를 누릅니다.
7. 서비스 계정 세부정보를 입력합니다.
8. `역할`은 `Project - 편집자`를 선택합니다.
9. `새 비공개 키 제공` 체크박스를 누릅니다.
10. `JSON`을 누릅니다.
11. `만들기`를 누릅니다.
12. 자동으로 다운로드되는 `.json` 파일을 엽니다. (이 파일은 반드시 백업해 두시기 바랍니다.)
13. `.json` 파일의 `client_email` 항목과 `private_key` 항목의 내용을 아래 [설정](#설정)에 기입합니다.
14. 구글 플레이 콘솔로 돌아와, `완료`를 누릅니다.
15. 서비스 계정이 나타나면 `액세스 권한 부여`를 누릅니다.
16. 역할을 `금융`으로 선택합니다.
17. `사용자 추가`를 누릅니다.
18. 모든 설정이 완료되었습니다.

***위 설정을 하여도 바로 적용되지 않고, 적용되는데 시간이 조금 걸립니다. 여유를 가지고 기다려주세요.***

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
}, (isValid) => {
	console.log(isValid);
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