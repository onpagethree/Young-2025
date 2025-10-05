// 슬라이드 갤러리
(function () {
	function initVanillaSlider(root) {
		if (!root) return;
		const track = root.querySelector(".slide-track");
		let originals = Array.from(track.children);
		const originalCount = originals.length;
		if (originals.length === 0) return;

		// 무한 루프를 위한 양방향 클론
		// 원본 순서를 유지하기 위해 앞뒤로 한 벌씩 복제
		const firstClone = originals[0].cloneNode(true);
		const lastClone = originals[originals.length - 1].cloneNode(true);
		track.insertBefore(lastClone, track.firstChild);
		track.appendChild(firstClone);

		// 재계산용 참조
		const allSlides = Array.from(track.children);
		const startIndex = 1; // 첫 원본의 실제 인덱스
		let index = startIndex; // 현재 선택 인덱스(첫 이미지가 중앙)
		let animating = false;

		// 트랜지션 토글
		function setAnimating(on) {
			track.style.transition = on ? "transform 420ms ease" : "none";
		}

		// 현재 index가 중앙에 오도록 트랙 이동
		function centerTo(i, useAnim = true) {
			const containerW = root.clientWidth;
			const target = allSlides[i];
			if (!target) return;

			const box = target.getBoundingClientRect(); // 너비 재기
			const slideCenter = target.offsetLeft + box.width / 2;
			const offset = slideCenter - containerW / 2; // 중앙 정렬 오프셋
			if (!useAnim) {
				setAnimating(false);
				void track.offsetWidth;
			} else {
				setAnimating(true);
			}

			track.style.transform = "translate3d(" + -offset + "px,0,0)";
			if (!useAnim) {
				// 리플로 완료 후 애니메이션 다시 활성화 수정한 내용
				requestAnimationFrame(() => setAnimating(false));
			}
		}

		// 경계 넘김 처리(무한 루프 점프)
		function normalizeIndex() {
			// 원본 마지막을 넘으면 같은 위치의 원본으로 점프
			if (index >= startIndex + originalCount) {
				index -= originalCount;
				centerTo(index, false);
			} else if (index < startIndex) {
				index += originalCount;
				centerTo(index, false);
			}
		}

		// 초기 위치(첫 이미지가 중앙)
		setAnimating(false);
		centerTo(index, false);
		setAnimating(true);

		// 좌/우 클릭(갤러리 좌우 절반 클릭 시 이동)
		root.addEventListener("click", function (e) {
			// 핫존 기준 분기
			const rect = root.getBoundingClientRect();
			const x = e.clientX - rect.left;
			if (animating) return;
			animating = true;
			if (x < rect.width / 2) index--;
			else index++;
			centerTo(index, true);
		});

		// 트랜지션 종료 후 루프 정규화
		track.addEventListener("transitionend", function () {
			normalizeIndex();
			animating = false;
		});

		// 터치 스와이프
		let tStartX = 0,
			tStartY = 0,
			tMoved = false;
		const SWIPE_THRESHOLD = 30; // px
		root.addEventListener(
			"touchstart",
			function (e) {
				const t = e.changedTouches[0];
				tStartX = t.clientX;
				tStartY = t.clientY;
				tMoved = false;
			},
			{ passive: true }
		);

		root.addEventListener(
			"touchmove",
			function (e) {
				tMoved = true;
			},
			{ passive: true }
		);

		root.addEventListener(
			"touchend",
			function (e) {
				const t = e.changedTouches[0];
				const dx = t.clientX - tStartX;
				const dy = t.clientY - tStartY;
				if (!tMoved || Math.abs(dx) < Math.max(SWIPE_THRESHOLD, Math.abs(dy)))
					return;
				if (animating) return;
				animating = true;
				if (dx < 0) index++;
				else index--;
				centerTo(index, true);
			},
			{ passive: true }
		);

		// 리사이즈 시 중앙 재계산
		window.addEventListener("resize", function () {
			setAnimating(false);
			centerTo(index, false);
			setAnimating(true);
		});
	}

	// 자동 초기화
	function ready(fn) {
		document.readyState !== "loading"
			? fn()
			: document.addEventListener("DOMContentLoaded", fn);
	}
	ready(function () {
		document.querySelectorAll(".slide-gallery").forEach(initVanillaSlider);
	});
})();
