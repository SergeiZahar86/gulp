

$(document).ready(function (){
	$('.wrapper').addClass('loaded');

// Для меню бургер
	$('.icon-menu').click(function(event) {
		$(this).toggleClass('active');
		$('.menu__body').toggleClass('active');
		$('body').toggleClass('lock');
	});

	//SLIDERS
	/*if($('.slider__body').length>0){
		$('.slider__body').slick({*/
	if($('').length>0){
		$('').slick({
			//autoplay: true,
			//infinite: false,
			dots: true,
			arrows: false,
			accessibility:false,
			slidesToShow:1,
			autoplaySpeed: 3000,
			adaptiveHeight:true,
			nextArrow:'<button type="button" class="slick-next"></button>',
			prevArrow:'<button type="button" class="slick-prev"></button>',
			responsive: [{
				breakpoint: 768,
				settings: {}
			}]
		});
	}
});


// применяется для фулскриновой заставки, начальной страницы, с картинкой (применяет дополнительный
// стиль к ibg)
function ibg(){
	$.each($('.ibg'), function(index, val) {
		if($(this).find('img').length>0){
			$(this).css('background-image','url("'+$(this).find('img').attr('src')+'")');
		}
	});
}
ibg();

//========== функция переноса элементов при адаптации =========================================================================================================================

// Dynamic Adapt v.1
// HTML data-da="where(uniq class name),position(digi),when(breakpoint)"
// e.x. data-da="item,2,992"
// Andrikanych Yevhen 2020
// https://www.youtube.com/c/freelancerlifestyle

"use strict";

(function () {
	let originalPositions = [];
	let daElements = document.querySelectorAll('[data-da]');
	let daElementsArray = [];
	let daMatchMedia = [];
	//Заполняем массивы
	if (daElements.length > 0) {
		let number = 0;
		for (let index = 0; index < daElements.length; index++) {
			const daElement = daElements[index];
			const daMove = daElement.getAttribute('data-da');
			if (daMove != '') {
				const daArray = daMove.split(',');
				const daPlace = daArray[1] ? daArray[1].trim() : 'last';
				const daBreakpoint = daArray[2] ? daArray[2].trim() : '767';
				const daType = daArray[3] === 'min' ? daArray[3].trim() : 'max';
				const daDestination = document.querySelector('.' + daArray[0].trim())
				if (daArray.length > 0 && daDestination) {
					daElement.setAttribute('data-da-index', number);

					//Заполняем массив первоначальных позиций для того чтобы потом вернуть элементы обратно
					originalPositions[number] = {
						"parent": daElement.parentNode,
						"index": indexInParent(daElement)
					};

					//Заполняем массив элементов
					daElementsArray[number] = {
						"element": daElement,
						"destination": document.querySelector('.' + daArray[0].trim()),
						"place": daPlace,
						"breakpoint": daBreakpoint,
						"type": daType
					}
					number++;
				}
			}
		}
		// сортируем элементы
		dynamicAdaptSort(daElementsArray);

		//Создаем события в точке брейкпоинта
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daBreakpoint = el.breakpoint;
			const daType = el.type;

			// слушаем реакцию браузера только в точках брейкпоинт
			daMatchMedia.push(window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px)"));
			daMatchMedia[index].addListener(dynamicAdapt);
		}
	}

	//Основная функция
	function dynamicAdapt(e) {
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daElement = el.element;
			const daDestination = el.destination;
			const daPlace = el.place;
			const daBreakpoint = el.breakpoint;
			const daClassname = "_dynamic_adapt_" + daBreakpoint;

			if (daMatchMedia[index].matches) {
				//Перебрасываем элементы
				if (!daElement.classList.contains(daClassname)) {
					let actualIndex = indexOfElements(daDestination)[daPlace];
					if (daPlace === 'first') {
						actualIndex = indexOfElements(daDestination)[0];
					} else if (daPlace === 'last') {
						actualIndex = indexOfElements(daDestination)[indexOfElements(daDestination).length];
					}
					daDestination.insertBefore(daElement, daDestination.children[actualIndex]);
					daElement.classList.add(daClassname);
				}
			} else {
				//Возвращаем на место
				if (daElement.classList.contains(daClassname)) {
					dynamicAdaptBack(daElement);
					daElement.classList.remove(daClassname);
				}
			}
		}
		//customAdapt();
	}

	//Вызов основной функции
	dynamicAdapt();

	//Функция возврата на место
	function dynamicAdaptBack(el) {
		const daIndex = el.getAttribute('data-da-index');
		const originalPlace = originalPositions[daIndex];
		const parentPlace = originalPlace['parent'];
		const indexPlace = originalPlace['index'];
		const actualIndex = indexOfElements(parentPlace, true)[indexPlace];
		parentPlace.insertBefore(el, parentPlace.children[actualIndex]);
	}

	//Функция получения индекса внутри родителя
	function indexInParent(el) {
		var children = Array.prototype.slice.call(el.parentNode.children);
		return children.indexOf(el);
	}

	//Функция получения массива индексов элементов внутри родителя
	function indexOfElements(parent, back) {
		const children = parent.children;
		const childrenArray = [];
		for (let i = 0; i < children.length; i++) {
			const childrenElement = children[i];
			if (back) {
				childrenArray.push(i);
			} else {
				//Исключая перенесенный раннее элемент
				if (childrenElement.getAttribute('data-da') == null) {
					childrenArray.push(i);
				}
			}
		}
		return childrenArray;
	}

	//Сортировка объекта
	function dynamicAdaptSort(arr) {
		arr.sort(function (a, b) {
			if (a.breakpoint > b.breakpoint) {
				return -1
			} else {
				return 1
			}
		});
		arr.sort(function (a, b) {
			if (a.place > b.place) {
				return 1
			} else {
				return -1
			}
		});
	}

	//Дополнительные сценарии адаптации
	function customAdapt() {
		//const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	}
}());





//=======================================================================================================================================
// ==============     скрипт для попапа     ==========================================================================================

const popupLinks = document.querySelectorAll('.popup-link');               // получаем все ссылки с классом '.popup-link' при
// клике на которые будет открываться попап

const body = document.querySelector('body');                              // получаем боди для обездвиживания его
const lockPadding = document.querySelectorAll(".lock-padding");           // для добавления правого пэдинга
let unlock = true;                                                                // флаг, false - в течении времени закрытия (800 мс)
const timeout = 800;                                                              // должна быть равна длине анимации


if (popupLinks.length > 0) // цепляем на все ссылки, которые открывают попапы, обр. событий
{
	for (let index = 0; index < popupLinks.length; index++)
	{
		const popupLink = popupLinks[index];
		popupLink.addEventListener("click", function (e)
		{
			const popupName = popupLink.getAttribute('href')
				.replace('#', '');                             // получаем имя попапа
			const curentPopup = document.getElementById(popupName);
			popupOpen(curentPopup);                                                 // открываем попап
			e.preventDefault();
		});
	}
}


const popupCloseIcon = document.querySelectorAll('.close-popup');      // все объекты для закрытия попапов
if (popupCloseIcon.length > 0)
{
	for (let index = 0; index < popupCloseIcon.length; index++)
	{
		const el = popupCloseIcon[index];
		el.addEventListener('click', function (e)
		{
			popupClose(el.closest('.popup'));                          // ищем родителя с классом '.popup' для кнопки закрытия
			e.preventDefault();
		});
	}
}


function popupOpen(curentPopup)  // открытие попапа
{
	if (curentPopup && unlock)
	{
		const popupActive = document.querySelector('.popup.open');   // находим уже открытые попапы
		if (popupActive)                                                     // если они существуют
		{
			popupClose(popupActive, false);                          // закрываем их
		} else
		{
			bodyLock();                                                      // или же убираем прокрутку у боди
		}
		curentPopup.classList.add('open');                                   // добавляем новому попапу класс 'open'
		curentPopup.addEventListener("click", function (e)                   // цепляем обработку события
		{
			if (!e.target.closest('.popup__content'))                 // для всего что за пределами '.popup__content'
			{
				popupClose(e.target.closest('.popup'));               // закрываем попап
			}
		});
	}
}


function popupClose(popupActive, doUnlock = true)                    // функция закрытия попапа с колбэком установки doUnlock
{
	if (unlock)                                                              // защищает от двойного нажатия
	{
		popupActive.classList.remove('open');                          // убираес класс 'open' у попапа
		if (doUnlock)
		{
			bodyUnLock();                                                    // убираем прокрутку у боди
		}
	}
}


function bodyLock()  // убираем прокрутку у боди и добавляем правый пэдинг для боди и шапки
{
	const lockPaddingValue =
		window.innerWidth - document.querySelector('.wrapper')
			.offsetWidth + 'px';

	if (lockPadding.length > 0)
	{
		for (let index = 0; index < lockPadding.length; index++)
		{
			const el = lockPadding[index];
			el.style.paddingRight = lockPaddingValue;
		}
	}
	body.style.paddingRight = lockPaddingValue;
	body.classList.add('lock');

	unlock = false;
	setTimeout(function ()
	{
		unlock = true;
	}, timeout);
}

function bodyUnLock()  // возвращаем прокрутку боди и убираем правый пэдинг
{
	setTimeout(function ()
	{
		if (lockPadding.length > 0)
		{
			for (let index = 0; index < lockPadding.length; index++)
			{
				const el = lockPadding[index];
				el.style.paddingRight = '0px';
			}
		}
		body.style.paddingRight = '0px';
		body.classList.remove('lock');
	}, timeout);

	unlock = false;
	setTimeout(function ()
	{
		unlock = true;
	}, timeout);
}

document.addEventListener('keydown', function (e) // закрываем попап по Esc
{
	if (e.which === 27)
	{
		const popupActive = document.querySelector('.popup.open');
		popupClose(popupActive);
	}
});

(function ()
{
	// проверяем поддержку
	if (!Element.prototype.closest)
	{
		// реализуем
		Element.prototype.closest = function (css)
		{
			var node = this;
			while (node)
			{
				if (node.matches(css)) return node;
				else node = node.parentElement;
			}
			return null;
		};
	}
})();
(function ()
{
	// проверяем поддержку
	if (!Element.prototype.matches)
	{
		// определяем свойство
		Element.prototype.matches = Element.prototype.matchesSelector ||
			Element.prototype.webkitMatchesSelector ||
			Element.prototype.mozMatchesSelector ||
			Element.prototype.msMatchesSelector;
	}
})();










