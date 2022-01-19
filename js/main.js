const getElement = (tagName, classNames, attributes) => {
	const element = document.createElement(tagName);

	if (classNames) {
		element.classList.add(...classNames);
	}

	if (attributes) {
		for (const attribute in attributes) {
			element[attribute] = attributes[attribute];
		}
	}

	return element;
};

const createHeader = ({ title, header: { logo, menu, social } }) => {
	const header = getElement('header');
	const container = getElement('div', ['container']);
	const wrapper = getElement('div', ['header']);

	if (logo) {
		const logoElem = getElement('img', ['logo'], {
			src: logo,
			alt: 'Логотип ' + title,
		});
		wrapper.append(logoElem);
	}

	if (menu) {
		const nav = getElement('nav', ['menu-list']);
		const allMenuLink = menu.map(item => {
			const link = getElement('a', ['menu-link'], {
				href: item.link,
				textContent: item.title,
			});
			return link;
		});
		nav.append(...allMenuLink);
		wrapper.append(nav);

		const menuBtn = getElement('button', ['menu-button']);
		menuBtn.addEventListener('click', () => {
			menuBtn.classList.toggle('menu-button-active');
			wrapper.classList.toggle('header-active');
		});
		container.append(menuBtn);
	}

	if (social) {
		const socialWrapper = getElement('div', ['social']);
		const allSocial = social.map(item => {
			const socialLink = getElement('a', ['social-link']);
			socialLink.append(
				getElement('img', [], {
					src: item.image,
					alt: item.title,
				})
			);

			socialLink.href = item.link;

			return socialLink;
		});

		socialWrapper.append(...allSocial);
		wrapper.append(socialWrapper);
	}

	header.append(container);
	container.append(wrapper);

	return header;
};

const createMain = ({
	title = 'Макс',
	main: { genre, rating, description, trailer, slider },
}) => {
	const main = getElement('main');
	const container = getElement('div', ['container']);
	main.append(container);
	const wrapper = getElement('div', ['main-content']);
	container.append(wrapper);
	const content = getElement('div', ['content']);
	wrapper.append(content);

	if (genre) {
		const genreSpan = getElement('span', ['genre', 'animated', 'fadeInRight'], {
			textContent: genre,
		});

		content.append(genreSpan);
	}

	if (rating) {
		const ratingBlock = getElement('div', [
			'rating',
			'animated',
			'fadeInRight',
		]);
		const ratingStars = getElement('div', ['rating-stars']);
		const ratingNumber = getElement('div', ['rating-number'], {
			textContent: `${rating}/10`,
		});

		for (let i = 0; i < 10; i++) {
			const star = getElement('img', ['star'], {
				alt: i ? '' : `Рейтинг ${rating} из 10`,
				src: i < rating ? 'img/star.svg' : 'img/star-o.svg',
			});
			ratingStars.append(star);
		}

		ratingBlock.append(ratingStars, ratingNumber);
		content.append(ratingBlock);
	}

	content.append(
		getElement('h1', ['main-title', 'animated', 'fadeInRight'], {
			textContent: title,
		})
	);

	if (description) {
		content.append(
			getElement('p', ['main-description', 'animated', 'fadeInRight'], {
				textContent: description,
			})
		);
	}

	if (trailer) {
		const youtubeLink = getElement(
			'a',
			['button', 'animated', 'fadeInRight', 'youtube-modal'],
			{
				href: trailer,
				textContent: 'Смотреть трейлер',
			}
		);

		const youtubeImgLink = getElement('a', ['play', 'youtube-modal'], {
			href: trailer,
			ariaLabel: 'Смотреть трейлер',
		});

		const iconPlay = getElement('img', ['play-img'], {
			src: 'img/play.svg',
			alt: '',
			ariaHidden: true,
		});

		content.append(youtubeLink);
		youtubeImgLink.append(iconPlay);
		wrapper.append(youtubeImgLink);
	}

	if (slider) {
		const sliderBlock = getElement('div', ['series']);
		const swiperBlock = getElement('div', ['swiper-container']);
		const swiperWrapper = getElement('div', ['swiper-wrapper']);
		const arrow = getElement('button', ['arrow']);

		const slides = slider.map(item => {
			const swiperSlide = getElement('a', ['swiper-slide'], {
				href: '#',
			});
			const card = getElement('figure', ['card']);
			const cardImage = getElement('img', ['card-img'], {
				src: item.img,
				alt: ((item.title || '') + ' ' + (item.subtitle || '')).trim(),
			});

			card.append(cardImage);

			if (item.title || item.subtitle) {
				const cardDescription = getElement('figcaption', ['card-description']);
				cardDescription.innerHTML = `
					${item.subtitle ? `<p class="card-subtitle">${item.subtitle}</p>` : ''}
					${item.title ? `<p class="card-title">${item.title}</p>` : ''}
				`;

				card.append(cardDescription);
			}
			swiperSlide.append(card);
			return swiperSlide;
		});

		swiperWrapper.append(...slides);
		swiperBlock.append(swiperWrapper);
		sliderBlock.append(swiperBlock, arrow);

		container.append(sliderBlock);

		new Swiper(swiperBlock, {
			loop: true,
			navigation: {
				nextEl: arrow,
			},
			breakpoints: {
				320: {
					slidesPerView: 1,
					spaceBetween: 20,
				},
				541: {
					slidesPerView: 2,
					spaceBetween: 40,
				},
			},
		});
	}

	return main;
};

const movieConstructor = (selector, options) => {
	const app = document.querySelector(selector);
	app.classList.add('body-app');

	app.style.color = options.fontColor || '';
	app.style.backgroundColor = options.backgroundColor || '';

	if (options.subColor) {
		document.documentElement.style.setProperty('--sub-color', options.subColor);
	}

	if (options.favicon) {
		const index = options.favicon.lastIndexOf('.');
		const type = options.favicon.substring(index + 1);

		const favicon = getElement('link', null, {
			rel: 'icon',
			href: options.favicon,
			type: 'image/' + (type === 'svg' ? 'svg-xml' : type),
		});

		document.head.append(favicon);
	}

	app.style.backgroundImage = options.background
		? `url("${options.background}")`
		: '';

	document.title = options.title;

	if (options.header) {
		app.append(createHeader(options));
	}

	if (options.main) {
		app.append(createMain(options));
	}
};
