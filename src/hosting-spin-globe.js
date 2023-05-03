import { Scene, PerspectiveCamera, WebGLRenderer, SphereGeometry, MeshPhongMaterial, Mesh, EdgesGeometry, LineBasicMaterial, LineSegments, DoubleSide, MathUtils, NoBlending } from './three.module.js';
(function () {
	function isSmallScreen() {
		return window.matchMedia('(max-width: 768px)').matches;
	}

	function isBetweenWidths(minWidth, maxWidth) {
		const mediaQuery = window.matchMedia(`(min-width: ${minWidth}px) and (max-width: ${maxWidth}px)`);
		return mediaQuery.matches;
	}

	function width() {
		return isSmallScreen()
			? window.innerWidth * 1.5
			: document.querySelector('.lp-hero-section').offsetHeight;
	}
	function height() {
		return width();
	}

	function responsiveData() {
		const isSmall = isSmallScreen();
	
		let z = 6;
		let y = isSmall ? 0.5 : 0.3;
		let x = 0.2;
	
		if (isBetweenWidths(769, 1151)) {
			y = 0.5;
			x = 0;
		} else if (isBetweenWidths(1152, 1669)) {
			z = 7;
			y = 0.5;
			x = 0.5;
		}
	
		return { x, y, z };
	}

	const direction = document.documentElement.attributes.getNamedItem('dir');
	const isRTL = direction && direction.value === 'rtl';

	var scene = new Scene();
	const position = responsiveData();
	var camera = new PerspectiveCamera(25, width() / height(), 0.1, 1000);
	camera.position.z = position.z;

	var renderer = new WebGLRenderer({
		antialias: true,
		alpha: true,
	});

	renderer.setSize(width(), height());

	var canvasContainer = document.createElement('div');
	canvasContainer.classList.add('lp-hosting-hero-globe');

	renderer.domElement.classList.add('globe');
	canvasContainer.appendChild(renderer.domElement);
	document.querySelector('.lp-hero-section').prepend(canvasContainer);

	const geometry = new SphereGeometry(1, 36, 36);

	var material = new MeshPhongMaterial({opacity: 0.0, blending: NoBlending, transparent: true });

	var mesh = new Mesh(geometry, material);
	mesh.rotation.x = MathUtils.degToRad(30);
	const zRotation = isRTL ? -30 : 30;
	mesh.rotation.z = MathUtils.degToRad(zRotation)
	mesh.position.y = position.y;
	mesh.position.x = isRTL ? (position.x * -1) : position.x
	scene.add(mesh);

	var geo = new EdgesGeometry(mesh.geometry);
	var mat = new LineBasicMaterial({
		color: '#5FBDFF',
		opacity: 0.5,
		side: DoubleSide
	});
	
	// Set up multiple lines to simulate a thicker line
	for (var i = 0; i < 4; i++) {
		var line = new LineSegments(geo, mat);
		line.position.set(0, 0, i * 0.0005); // offset each line slightly along the z-axis
		mesh.add(line);
  	}
  
  

	var lastTime = 0;
	function animate() {
		const now = performance.now();
		let time = (now - lastTime) / 1000;
		lastTime = now ;
		let rotation =   (time / 92) * (isRTL ? -1 : 1);
		rotation *= isRTL ? -1 : 1;
		mesh.rotateY(rotation);
		renderer.render(scene, camera);
		requestAnimationFrame(animate);
	}

	animate();

	function onWindowResize() {
		//re-position camera to keep globe stick to the top of the screen
		camera.position.z = responsiveData().z;
		mesh.position.x = responsiveData().x;
		mesh.position.y = responsiveData().y;
		renderer.setSize(width(), height());
	}

	window.addEventListener('resize', onWindowResize, false);
})();

(function () {
	const container = document.querySelector('.lp-testimonials-content');

	if (!container) {
		return;
	}

	const scrollHandler = function (event) {
		// Horizontal scrolling detected -- we don't need to intercept
		if (Math.abs(event.deltaX) !== 0) {
			container.removeEventListener('wheel', scrollHandler);
			return;
		}

		if (container.contains(event.target)) {
			container.scrollLeft += event.deltaY;
			event.preventDefault();
		}
	};

	container.addEventListener('wheel', scrollHandler, {passive: false});
})();
