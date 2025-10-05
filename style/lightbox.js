// 라이트박스
(function ($) {
	$(function () {
		const $lightbox = $("#lightbox");
		const $img = $("#lightbox-img");
		const $prev = $(".lightbox .prev");
		const $next = $(".lightbox .next");
		const $close = $(".lightbox .close");
		const $center = $(".lightbox .lightbox-center");

		let $currentGallery = null;
		let srcs = [];
		let idx = 0;

		function openGallery($gallery, startIndex) {
			$currentGallery = $gallery;
			srcs = $gallery
				.find(".gallery-box")
				.map(function () {
					return this.getAttribute("href");
				})
				.get();

			idx = startIndex;
			update();
			$lightbox.show();
			$("body").addClass("lightbox-open no-scroll");
		}

		function close() {
			$lightbox.hide();
			$("body").removeClass("lightbox-open no-scroll");
			$currentGallery = null;
			srcs = [];
			idx = 0;
		}

		function update() {
			if (!srcs.length) return;
			$img.attr("src", srcs[idx]);
		}

		function prev() {
			if (!srcs.length) return;
			idx = (idx - 1 + srcs.length) % srcs.length;
			update();
		}

		function next() {
			if (!srcs.length) return;
			idx = (idx + 1) % srcs.length;
			update();
		}

		// 썸네일 클릭
		$(".image-gallery").on("click", ".gallery-box", function (e) {
			e.preventDefault();
			const $gallery = $(this).closest(".image-gallery");
			const i = $gallery.find(".gallery-box").index(this);
			openGallery($gallery, i);
		});

		// 버튼
		$prev.on("click", function (e) {
			e.stopPropagation();
			prev();
		});
		$next.on("click", function (e) {
			e.stopPropagation();
			next();
		});
		$close.on("click", function (e) {
			e.stopPropagation();
			close();
		});

		// 오버레이 빈 공간 클릭 시 닫기
		$lightbox.on("click", function (e) {
			// lightbox-center 바깥을 클릭한 경우에만 닫기
			if ($(e.target).closest(".lightbox-center").length === 0) {
				close();
			}
		});

		// 라이트박스 내부 클릭은 전파 막기(이미지/버튼 클릭 시 오버레이로 전파되어 닫히는 문제 방지)
		$center.on("click", function (e) {
			e.stopPropagation();
		});

		// 키보드 제어
		$(document).on("keydown", function (e) {
			if (!$lightbox.is(":visible")) return;
			if (e.key === "Escape") close();
			if (e.key === "ArrowLeft") prev();
			if (e.key === "ArrowRight") next();
		});

		// 터치 스와이프
		let startX = null;
		$center.on("touchstart", function (e) {
			startX = e.originalEvent.touches[0].clientX;
		});
		$center.on("touchend", function (e) {
			if (startX == null) return;
			const dx = e.originalEvent.changedTouches[0].clientX - startX;
			if (dx > 40) prev();
			if (dx < -40) next();
			startX = null;
		});
	});
})(jQuery);
