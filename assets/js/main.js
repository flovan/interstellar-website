(function(window){

'use strict';

//------ Init libs

FastClick.attach(document.body);

//------ Grab some elements

var
	injectTarget = document.getElementById('loadcss-target'),
	codeTarget = document.getElementById('code-target'),
	codeWrapper = codeTarget.parentElement,
	demo = codeWrapper.parentElement,
	loadingClass = 'is-loading',
	langToggle = document.getElementById('lang-toggle'),
	navButtons = document.querySelectorAll('.nav__button'),
	themeButtons = document.querySelectorAll('.button--grad'),
	activeClass = 'is-active',
	httpRequest = new XMLHttpRequest(),
	baseRoute = 'assets/code',
	stylesDir = 'styles',
	sourceExt = '.html',
	styleExt = '.css';
;

//------ Add some listeners

window.addEventListener('keyup', windowKeyUpHandler);
langToggle.addEventListener('change', langToggleChangeHandler);
httpRequest.addEventListener('load', httpRequestLoadHandler);

Utils.forEach(navButtons, function (el, index) {
	el.addEventListener('click', navButtonClickHandler);
});

Utils.forEach(themeButtons, function (el, index) {
	el.addEventListener('click', themeButtonClickHandler);
});

//------ Actions

langToggleChangeHandler();
getActiveThemeButton().click();

//------ Helper functions

function getActiveThemeButton () {
	var activeEl = null;

	Utils.forEach(themeButtons, function (el, index) {
		if (el.classList.contains(activeClass)) {
			activeEl = el;
		}
	});

	return activeEl;
}

function switchActiveTab (oldTab, newTab) {
	oldTab.classList.remove(activeClass);
	newTab.classList.add(activeClass);

	demo.classList.add(loadingClass);
	loadTheme(newTab.getAttribute('data-id'));
}

function loadTheme (id) {
	var currentTheme = injectTarget.previousElementSibling,
		stylesheet;
	
	if (currentTheme.nodeName.toLowerCase() === 'script') {
		currentTheme.parentNode.removeChild(currentTheme);
	}

	demo.classList.add(loadingClass);
	stylesheet = loadCSS(baseRoute + '/' + stylesDir + '/' + id + styleExt, injectTarget);
	Utils.onloadCSS(stylesheet, loadCSSDoneCallback);
}

//------ Handler functions

function windowKeyUpHandler (e) {
	// Left
	if (e.keyCode === 37) {
		navButtons[0].click();
		navButtons[0].focus();
		return;
	}

	// Right
	if (e.keyCode === 39) {
		navButtons[1].click();
		navButtons[1].focus();
		return;
	}
}

function langToggleChangeHandler (e) {
	var
		val = langToggle.value,
		fileRoute = baseRoute + '/' + val + sourceExt;
	;

	httpRequest.open('GET', fileRoute, true);
	httpRequest.send();
}

function httpRequestLoadHandler (e) {
	var
		line = 1,
		content = hljs.fixMarkup(httpRequest.responseText)
	;

	content = content.replace(/^/gm, function() {
		return '<span class="line-number-position">&#x200b;<span class="line-number" data-number="' + line++ + '"></span></span>';
	});

	codeTarget.removeAttribute('class');
	codeTarget.classList.add('lang-' + langToggle.value);
	codeTarget.innerHTML = content;

	hljs.highlightBlock(codeTarget);
	demo.classList.remove(loadingClass);
}

function navButtonClickHandler (e) {
	var 
		trg = e.currentTarget,
		isPrev = trg.classList.contains('nav__prev'),
		activeThemeButton = getActiveThemeButton(),
		newTarget = null;
	;

	if (isPrev) {
		if (activeThemeButton.previousElementSibling !== null) {
			newTarget = activeThemeButton.previousElementSibling;
		} else {
			newTarget = themeButtons[themeButtons.length - 1];
		}
	} else {
		if (activeThemeButton.nextElementSibling !== null) {
			newTarget = activeThemeButton.nextElementSibling;
		} else {
			newTarget = themeButtons[0];
		}
	}

	switchActiveTab(activeThemeButton, newTarget);
}

function themeButtonClickHandler (e) {
	switchActiveTab(getActiveThemeButton(), e.currentTarget);
}

function loadCSSDoneCallback (e) {
	//hljs.highlightBlock(codeTarget);
	demo.classList.remove(loadingClass);
}

}(window));
