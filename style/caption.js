document.addEventListener("DOMContentLoaded", function () {
	document
		.getElementById("toggle-button")
		.addEventListener("click", function () {
			var moreTextElements = document.querySelectorAll(".more-text"); // 동일한 클래스 이름을 가진 모든 요소 선택
			var isHidden =
				moreTextElements[0].style.display === "none" ||
				moreTextElements[0].style.display === ""; // 첫 번째 span의 상태 체크

			moreTextElements.forEach(function (element) {
				if (isHidden) {
					element.style.display = "inline"; // 텍스트 표시
					document.getElementById("toggle-button").innerText = "접기"; // 버튼 텍스트 변경
				} else {
					element.style.display = "none"; // 텍스트 숨기기
					document.getElementById("toggle-button").innerText = "더 보기"; // 버튼 텍스트 변경
				}
			});
		});
});
