define(['jquery','com/event','com/carousel','com/gotop','com/waterFull'], function($, Event, Carousel, GoTop, waterFull) {

	Carousel.init($('.carousel'));

	new GoTop();

	waterFull.start($('.load-container'));
})