// 스크롤 시 떠오르는 모션
// 스크롤 시 떠오르는 모션

// 요소가 화면에 들어왔는지 감지하는 함수
// 요소가 화면에 들어왔는지 감지하는 함수
function isInViewport(element) {
	const rect = element.getBoundingClientRect();
	const offset = window.innerHeight * -0.001; // 화면의 하단 .5% 여유를 둠
	return rect.top <= window.innerHeight - offset && rect.bottom >= 0;
}

// 스크롤 시 요소가 보이면 'show' 클래스를 추가하는 함수
function addScrollAnimation() {
	const allElements = document.querySelectorAll("*"); // 모든 요소 선택

	allElements.forEach((element) => {
		if (isInViewport(element)) {
			element.classList.add("show"); // 화면에 들어왔을 때 'show' 클래스 추가
		}
	});
}

// 스크롤 및 로드 시 함수 호출
window.addEventListener("scroll", addScrollAnimation);
window.addEventListener("load", addScrollAnimation);
