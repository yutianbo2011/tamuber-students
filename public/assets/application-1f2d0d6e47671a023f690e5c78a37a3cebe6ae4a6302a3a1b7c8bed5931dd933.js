/*
Unobtrusive JavaScript
https://github.com/rails/rails/blob/master/actionview/app/assets/javascripts
Released under the MIT license
 */


(function() {
  var context = this;

  (function() {
    (function() {
      this.Rails = {
        linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote]:not([disabled]), a[data-disable-with], a[data-disable]',
        buttonClickSelector: {
          selector: 'button[data-remote]:not([form]), button[data-confirm]:not([form])',
          exclude: 'form button'
        },
        inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',
        formSubmitSelector: 'form',
        formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])',
        formDisableSelector: 'input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled',
        formEnableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled',
        fileInputSelector: 'input[name][type=file]:not([disabled])',
        linkDisableSelector: 'a[data-disable-with], a[data-disable]',
        buttonDisableSelector: 'button[data-remote][data-disable-with], button[data-remote][data-disable]'
      };

    }).call(this);
  }).call(context);

  var Rails = context.Rails;

  (function() {
    (function() {
      var expando, m;

      m = Element.prototype.matches || Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector;

      Rails.matches = function(element, selector) {
        if (selector.exclude != null) {
          return m.call(element, selector.selector) && !m.call(element, selector.exclude);
        } else {
          return m.call(element, selector);
        }
      };

      expando = '_ujsData';

      Rails.getData = function(element, key) {
        var ref;
        return (ref = element[expando]) != null ? ref[key] : void 0;
      };

      Rails.setData = function(element, key, value) {
        if (element[expando] == null) {
          element[expando] = {};
        }
        return element[expando][key] = value;
      };

      Rails.$ = function(selector) {
        return Array.prototype.slice.call(document.querySelectorAll(selector));
      };

    }).call(this);
    (function() {
      var $, csrfParam, csrfToken;

      $ = Rails.$;

      csrfToken = Rails.csrfToken = function() {
        var meta;
        meta = document.querySelector('meta[name=csrf-token]');
        return meta && meta.content;
      };

      csrfParam = Rails.csrfParam = function() {
        var meta;
        meta = document.querySelector('meta[name=csrf-param]');
        return meta && meta.content;
      };

      Rails.CSRFProtection = function(xhr) {
        var token;
        token = csrfToken();
        if (token != null) {
          return xhr.setRequestHeader('X-CSRF-Token', token);
        }
      };

      Rails.refreshCSRFTokens = function() {
        var param, token;
        token = csrfToken();
        param = csrfParam();
        if ((token != null) && (param != null)) {
          return $('form input[name="' + param + '"]').forEach(function(input) {
            return input.value = token;
          });
        }
      };

    }).call(this);
    (function() {
      var CustomEvent, fire, matches;

      matches = Rails.matches;

      CustomEvent = window.CustomEvent;

      if (typeof CustomEvent !== 'function') {
        CustomEvent = function(event, params) {
          var evt;
          evt = document.createEvent('CustomEvent');
          evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
          return evt;
        };
        CustomEvent.prototype = window.Event.prototype;
      }

      fire = Rails.fire = function(obj, name, data) {
        var event;
        event = new CustomEvent(name, {
          bubbles: true,
          cancelable: true,
          detail: data
        });
        obj.dispatchEvent(event);
        return !event.defaultPrevented;
      };

      Rails.stopEverything = function(e) {
        fire(e.target, 'ujs:everythingStopped');
        e.preventDefault();
        e.stopPropagation();
        return e.stopImmediatePropagation();
      };

      Rails.delegate = function(element, selector, eventType, handler) {
        return element.addEventListener(eventType, function(e) {
          var target;
          target = e.target;
          while (!(!(target instanceof Element) || matches(target, selector))) {
            target = target.parentNode;
          }
          if (target instanceof Element && handler.call(target, e) === false) {
            e.preventDefault();
            return e.stopPropagation();
          }
        });
      };

    }).call(this);
    (function() {
      var AcceptHeaders, CSRFProtection, createXHR, fire, prepareOptions, processResponse;

      CSRFProtection = Rails.CSRFProtection, fire = Rails.fire;

      AcceptHeaders = {
        '*': '*/*',
        text: 'text/plain',
        html: 'text/html',
        xml: 'application/xml, text/xml',
        json: 'application/json, text/javascript',
        script: 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript'
      };

      Rails.ajax = function(options) {
        var xhr;
        options = prepareOptions(options);
        xhr = createXHR(options, function() {
          var response;
          response = processResponse(xhr.response, xhr.getResponseHeader('Content-Type'));
          if (Math.floor(xhr.status / 100) === 2) {
            if (typeof options.success === "function") {
              options.success(response, xhr.statusText, xhr);
            }
          } else {
            if (typeof options.error === "function") {
              options.error(response, xhr.statusText, xhr);
            }
          }
          return typeof options.complete === "function" ? options.complete(xhr, xhr.statusText) : void 0;
        });
        if (!(typeof options.beforeSend === "function" ? options.beforeSend(xhr, options) : void 0)) {
          return false;
        }
        if (xhr.readyState === XMLHttpRequest.OPENED) {
          return xhr.send(options.data);
        }
      };

      prepareOptions = function(options) {
        options.url = options.url || location.href;
        options.type = options.type.toUpperCase();
        if (options.type === 'GET' && options.data) {
          if (options.url.indexOf('?') < 0) {
            options.url += '?' + options.data;
          } else {
            options.url += '&' + options.data;
          }
        }
        if (AcceptHeaders[options.dataType] == null) {
          options.dataType = '*';
        }
        options.accept = AcceptHeaders[options.dataType];
        if (options.dataType !== '*') {
          options.accept += ', */*; q=0.01';
        }
        return options;
      };

      createXHR = function(options, done) {
        var xhr;
        xhr = new XMLHttpRequest();
        xhr.open(options.type, options.url, true);
        xhr.setRequestHeader('Accept', options.accept);
        if (typeof options.data === 'string') {
          xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        }
        if (!options.crossDomain) {
          xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        }
        CSRFProtection(xhr);
        xhr.withCredentials = !!options.withCredentials;
        xhr.onreadystatechange = function() {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            return done(xhr);
          }
        };
        return xhr;
      };

      processResponse = function(response, type) {
        var parser, script;
        if (typeof response === 'string' && typeof type === 'string') {
          if (type.match(/\bjson\b/)) {
            try {
              response = JSON.parse(response);
            } catch (error) {}
          } else if (type.match(/\b(?:java|ecma)script\b/)) {
            script = document.createElement('script');
            script.text = response;
            document.head.appendChild(script).parentNode.removeChild(script);
          } else if (type.match(/\b(xml|html|svg)\b/)) {
            parser = new DOMParser();
            type = type.replace(/;.+/, '');
            try {
              response = parser.parseFromString(response, type);
            } catch (error) {}
          }
        }
        return response;
      };

      Rails.href = function(element) {
        return element.href;
      };

      Rails.isCrossDomain = function(url) {
        var e, originAnchor, urlAnchor;
        originAnchor = document.createElement('a');
        originAnchor.href = location.href;
        urlAnchor = document.createElement('a');
        try {
          urlAnchor.href = url;
          return !(((!urlAnchor.protocol || urlAnchor.protocol === ':') && !urlAnchor.host) || (originAnchor.protocol + '//' + originAnchor.host === urlAnchor.protocol + '//' + urlAnchor.host));
        } catch (error) {
          e = error;
          return true;
        }
      };

    }).call(this);
    (function() {
      var matches, toArray;

      matches = Rails.matches;

      toArray = function(e) {
        return Array.prototype.slice.call(e);
      };

      Rails.serializeElement = function(element, additionalParam) {
        var inputs, params;
        inputs = [element];
        if (matches(element, 'form')) {
          inputs = toArray(element.elements);
        }
        params = [];
        inputs.forEach(function(input) {
          if (!input.name || input.disabled) {
            return;
          }
          if (matches(input, 'select')) {
            return toArray(input.options).forEach(function(option) {
              if (option.selected) {
                return params.push({
                  name: input.name,
                  value: option.value
                });
              }
            });
          } else if (input.checked || ['radio', 'checkbox', 'submit'].indexOf(input.type) === -1) {
            return params.push({
              name: input.name,
              value: input.value
            });
          }
        });
        if (additionalParam) {
          params.push(additionalParam);
        }
        return params.map(function(param) {
          if (param.name != null) {
            return (encodeURIComponent(param.name)) + "=" + (encodeURIComponent(param.value));
          } else {
            return param;
          }
        }).join('&');
      };

      Rails.formElements = function(form, selector) {
        if (matches(form, 'form')) {
          return toArray(form.elements).filter(function(el) {
            return matches(el, selector);
          });
        } else {
          return toArray(form.querySelectorAll(selector));
        }
      };

    }).call(this);
    (function() {
      var allowAction, fire, stopEverything;

      fire = Rails.fire, stopEverything = Rails.stopEverything;

      Rails.handleConfirm = function(e) {
        if (!allowAction(this)) {
          return stopEverything(e);
        }
      };

      allowAction = function(element) {
        var answer, callback, message;
        message = element.getAttribute('data-confirm');
        if (!message) {
          return true;
        }
        answer = false;
        if (fire(element, 'confirm')) {
          try {
            answer = confirm(message);
          } catch (error) {}
          callback = fire(element, 'confirm:complete', [answer]);
        }
        return answer && callback;
      };

    }).call(this);
    (function() {
      var disableFormElement, disableFormElements, disableLinkElement, enableFormElement, enableFormElements, enableLinkElement, formElements, getData, matches, setData, stopEverything;

      matches = Rails.matches, getData = Rails.getData, setData = Rails.setData, stopEverything = Rails.stopEverything, formElements = Rails.formElements;

      Rails.handleDisabledElement = function(e) {
        var element;
        element = this;
        if (element.disabled) {
          return stopEverything(e);
        }
      };

      Rails.enableElement = function(e) {
        var element;
        element = e instanceof Event ? e.target : e;
        if (matches(element, Rails.linkDisableSelector)) {
          return enableLinkElement(element);
        } else if (matches(element, Rails.buttonDisableSelector) || matches(element, Rails.formEnableSelector)) {
          return enableFormElement(element);
        } else if (matches(element, Rails.formSubmitSelector)) {
          return enableFormElements(element);
        }
      };

      Rails.disableElement = function(e) {
        var element;
        element = e instanceof Event ? e.target : e;
        if (matches(element, Rails.linkDisableSelector)) {
          return disableLinkElement(element);
        } else if (matches(element, Rails.buttonDisableSelector) || matches(element, Rails.formDisableSelector)) {
          return disableFormElement(element);
        } else if (matches(element, Rails.formSubmitSelector)) {
          return disableFormElements(element);
        }
      };

      disableLinkElement = function(element) {
        var replacement;
        replacement = element.getAttribute('data-disable-with');
        if (replacement != null) {
          setData(element, 'ujs:enable-with', element.innerHTML);
          element.innerHTML = replacement;
        }
        element.addEventListener('click', stopEverything);
        return setData(element, 'ujs:disabled', true);
      };

      enableLinkElement = function(element) {
        var originalText;
        originalText = getData(element, 'ujs:enable-with');
        if (originalText != null) {
          element.innerHTML = originalText;
          setData(element, 'ujs:enable-with', null);
        }
        element.removeEventListener('click', stopEverything);
        return setData(element, 'ujs:disabled', null);
      };

      disableFormElements = function(form) {
        return formElements(form, Rails.formDisableSelector).forEach(disableFormElement);
      };

      disableFormElement = function(element) {
        var replacement;
        replacement = element.getAttribute('data-disable-with');
        if (replacement != null) {
          if (matches(element, 'button')) {
            setData(element, 'ujs:enable-with', element.innerHTML);
            element.innerHTML = replacement;
          } else {
            setData(element, 'ujs:enable-with', element.value);
            element.value = replacement;
          }
        }
        element.disabled = true;
        return setData(element, 'ujs:disabled', true);
      };

      enableFormElements = function(form) {
        return formElements(form, Rails.formEnableSelector).forEach(enableFormElement);
      };

      enableFormElement = function(element) {
        var originalText;
        originalText = getData(element, 'ujs:enable-with');
        if (originalText != null) {
          if (matches(element, 'button')) {
            element.innerHTML = originalText;
          } else {
            element.value = originalText;
          }
          setData(element, 'ujs:enable-with', null);
        }
        element.disabled = false;
        return setData(element, 'ujs:disabled', null);
      };

    }).call(this);
    (function() {
      var stopEverything;

      stopEverything = Rails.stopEverything;

      Rails.handleMethod = function(e) {
        var csrfParam, csrfToken, form, formContent, href, link, method;
        link = this;
        method = link.getAttribute('data-method');
        if (!method) {
          return;
        }
        href = Rails.href(link);
        csrfToken = Rails.csrfToken();
        csrfParam = Rails.csrfParam();
        form = document.createElement('form');
        formContent = "<input name='_method' value='" + method + "' type='hidden' />";
        if ((csrfParam != null) && (csrfToken != null) && !Rails.isCrossDomain(href)) {
          formContent += "<input name='" + csrfParam + "' value='" + csrfToken + "' type='hidden' />";
        }
        formContent += '<input type="submit" />';
        form.method = 'post';
        form.action = href;
        form.target = link.target;
        form.innerHTML = formContent;
        form.style.display = 'none';
        document.body.appendChild(form);
        form.querySelector('[type="submit"]').click();
        return stopEverything(e);
      };

    }).call(this);
    (function() {
      var ajax, fire, getData, isCrossDomain, isRemote, matches, serializeElement, setData, stopEverything,
        slice = [].slice;

      matches = Rails.matches, getData = Rails.getData, setData = Rails.setData, fire = Rails.fire, stopEverything = Rails.stopEverything, ajax = Rails.ajax, isCrossDomain = Rails.isCrossDomain, serializeElement = Rails.serializeElement;

      isRemote = function(element) {
        var value;
        value = element.getAttribute('data-remote');
        return (value != null) && value !== 'false';
      };

      Rails.handleRemote = function(e) {
        var button, data, dataType, element, method, url, withCredentials;
        element = this;
        if (!isRemote(element)) {
          return true;
        }
        if (!fire(element, 'ajax:before')) {
          fire(element, 'ajax:stopped');
          return false;
        }
        withCredentials = element.getAttribute('data-with-credentials');
        dataType = element.getAttribute('data-type') || 'script';
        if (matches(element, Rails.formSubmitSelector)) {
          button = getData(element, 'ujs:submit-button');
          method = getData(element, 'ujs:submit-button-formmethod') || element.method;
          url = getData(element, 'ujs:submit-button-formaction') || element.getAttribute('action') || location.href;
          if (method.toUpperCase() === 'GET') {
            url = url.replace(/\?.*$/, '');
          }
          if (element.enctype === 'multipart/form-data') {
            data = new FormData(element);
            if (button != null) {
              data.append(button.name, button.value);
            }
          } else {
            data = serializeElement(element, button);
          }
          setData(element, 'ujs:submit-button', null);
          setData(element, 'ujs:submit-button-formmethod', null);
          setData(element, 'ujs:submit-button-formaction', null);
        } else if (matches(element, Rails.buttonClickSelector) || matches(element, Rails.inputChangeSelector)) {
          method = element.getAttribute('data-method');
          url = element.getAttribute('data-url');
          data = serializeElement(element, element.getAttribute('data-params'));
        } else {
          method = element.getAttribute('data-method');
          url = Rails.href(element);
          data = element.getAttribute('data-params');
        }
        ajax({
          type: method || 'GET',
          url: url,
          data: data,
          dataType: dataType,
          beforeSend: function(xhr, options) {
            if (fire(element, 'ajax:beforeSend', [xhr, options])) {
              return fire(element, 'ajax:send', [xhr]);
            } else {
              fire(element, 'ajax:stopped');
              return false;
            }
          },
          success: function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return fire(element, 'ajax:success', args);
          },
          error: function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return fire(element, 'ajax:error', args);
          },
          complete: function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return fire(element, 'ajax:complete', args);
          },
          crossDomain: isCrossDomain(url),
          withCredentials: (withCredentials != null) && withCredentials !== 'false'
        });
        return stopEverything(e);
      };

      Rails.formSubmitButtonClick = function(e) {
        var button, form;
        button = this;
        form = button.form;
        if (!form) {
          return;
        }
        if (button.name) {
          setData(form, 'ujs:submit-button', {
            name: button.name,
            value: button.value
          });
        }
        setData(form, 'ujs:formnovalidate-button', button.formNoValidate);
        setData(form, 'ujs:submit-button-formaction', button.getAttribute('formaction'));
        return setData(form, 'ujs:submit-button-formmethod', button.getAttribute('formmethod'));
      };

      Rails.handleMetaClick = function(e) {
        var data, link, metaClick, method;
        link = this;
        method = (link.getAttribute('data-method') || 'GET').toUpperCase();
        data = link.getAttribute('data-params');
        metaClick = e.metaKey || e.ctrlKey;
        if (metaClick && method === 'GET' && !data) {
          return e.stopImmediatePropagation();
        }
      };

    }).call(this);
    (function() {
      var $, CSRFProtection, delegate, disableElement, enableElement, fire, formSubmitButtonClick, getData, handleConfirm, handleDisabledElement, handleMetaClick, handleMethod, handleRemote, refreshCSRFTokens;

      fire = Rails.fire, delegate = Rails.delegate, getData = Rails.getData, $ = Rails.$, refreshCSRFTokens = Rails.refreshCSRFTokens, CSRFProtection = Rails.CSRFProtection, enableElement = Rails.enableElement, disableElement = Rails.disableElement, handleDisabledElement = Rails.handleDisabledElement, handleConfirm = Rails.handleConfirm, handleRemote = Rails.handleRemote, formSubmitButtonClick = Rails.formSubmitButtonClick, handleMetaClick = Rails.handleMetaClick, handleMethod = Rails.handleMethod;

      if ((typeof jQuery !== "undefined" && jQuery !== null) && (jQuery.ajax != null) && !jQuery.rails) {
        jQuery.rails = Rails;
        jQuery.ajaxPrefilter(function(options, originalOptions, xhr) {
          if (!options.crossDomain) {
            return CSRFProtection(xhr);
          }
        });
      }

      Rails.start = function() {
        if (window._rails_loaded) {
          throw new Error('rails-ujs has already been loaded!');
        }
        window.addEventListener('pageshow', function() {
          $(Rails.formEnableSelector).forEach(function(el) {
            if (getData(el, 'ujs:disabled')) {
              return enableElement(el);
            }
          });
          return $(Rails.linkDisableSelector).forEach(function(el) {
            if (getData(el, 'ujs:disabled')) {
              return enableElement(el);
            }
          });
        });
        delegate(document, Rails.linkDisableSelector, 'ajax:complete', enableElement);
        delegate(document, Rails.linkDisableSelector, 'ajax:stopped', enableElement);
        delegate(document, Rails.buttonDisableSelector, 'ajax:complete', enableElement);
        delegate(document, Rails.buttonDisableSelector, 'ajax:stopped', enableElement);
        delegate(document, Rails.linkClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.linkClickSelector, 'click', handleConfirm);
        delegate(document, Rails.linkClickSelector, 'click', handleMetaClick);
        delegate(document, Rails.linkClickSelector, 'click', disableElement);
        delegate(document, Rails.linkClickSelector, 'click', handleRemote);
        delegate(document, Rails.linkClickSelector, 'click', handleMethod);
        delegate(document, Rails.buttonClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.buttonClickSelector, 'click', handleConfirm);
        delegate(document, Rails.buttonClickSelector, 'click', disableElement);
        delegate(document, Rails.buttonClickSelector, 'click', handleRemote);
        delegate(document, Rails.inputChangeSelector, 'change', handleDisabledElement);
        delegate(document, Rails.inputChangeSelector, 'change', handleConfirm);
        delegate(document, Rails.inputChangeSelector, 'change', handleRemote);
        delegate(document, Rails.formSubmitSelector, 'submit', handleDisabledElement);
        delegate(document, Rails.formSubmitSelector, 'submit', handleConfirm);
        delegate(document, Rails.formSubmitSelector, 'submit', handleRemote);
        delegate(document, Rails.formSubmitSelector, 'submit', function(e) {
          return setTimeout((function() {
            return disableElement(e);
          }), 13);
        });
        delegate(document, Rails.formSubmitSelector, 'ajax:send', disableElement);
        delegate(document, Rails.formSubmitSelector, 'ajax:complete', enableElement);
        delegate(document, Rails.formInputClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.formInputClickSelector, 'click', handleConfirm);
        delegate(document, Rails.formInputClickSelector, 'click', formSubmitButtonClick);
        document.addEventListener('DOMContentLoaded', refreshCSRFTokens);
        return window._rails_loaded = true;
      };

      if (window.Rails === Rails && fire(document, 'rails:attachBindings')) {
        Rails.start();
      }

    }).call(this);
  }).call(this);

  if (typeof module === "object" && module.exports) {
    module.exports = Rails;
  } else if (typeof define === "function" && define.amd) {
    define(Rails);
  }
}).call(this);
/*
Turbolinks 5.2.0
Copyright © 2018 Basecamp, LLC
 */

(function(){var t=this;(function(){(function(){this.Turbolinks={supported:function(){return null!=window.history.pushState&&null!=window.requestAnimationFrame&&null!=window.addEventListener}(),visit:function(t,r){return e.controller.visit(t,r)},clearCache:function(){return e.controller.clearCache()},setProgressBarDelay:function(t){return e.controller.setProgressBarDelay(t)}}}).call(this)}).call(t);var e=t.Turbolinks;(function(){(function(){var t,r,n,o=[].slice;e.copyObject=function(t){var e,r,n;r={};for(e in t)n=t[e],r[e]=n;return r},e.closest=function(e,r){return t.call(e,r)},t=function(){var t,e;return t=document.documentElement,null!=(e=t.closest)?e:function(t){var e;for(e=this;e;){if(e.nodeType===Node.ELEMENT_NODE&&r.call(e,t))return e;e=e.parentNode}}}(),e.defer=function(t){return setTimeout(t,1)},e.throttle=function(t){var e;return e=null,function(){var r;return r=1<=arguments.length?o.call(arguments,0):[],null!=e?e:e=requestAnimationFrame(function(n){return function(){return e=null,t.apply(n,r)}}(this))}},e.dispatch=function(t,e){var r,o,i,s,a,u;return a=null!=e?e:{},u=a.target,r=a.cancelable,o=a.data,i=document.createEvent("Events"),i.initEvent(t,!0,r===!0),i.data=null!=o?o:{},i.cancelable&&!n&&(s=i.preventDefault,i.preventDefault=function(){return this.defaultPrevented||Object.defineProperty(this,"defaultPrevented",{get:function(){return!0}}),s.call(this)}),(null!=u?u:document).dispatchEvent(i),i},n=function(){var t;return t=document.createEvent("Events"),t.initEvent("test",!0,!0),t.preventDefault(),t.defaultPrevented}(),e.match=function(t,e){return r.call(t,e)},r=function(){var t,e,r,n;return t=document.documentElement,null!=(e=null!=(r=null!=(n=t.matchesSelector)?n:t.webkitMatchesSelector)?r:t.msMatchesSelector)?e:t.mozMatchesSelector}(),e.uuid=function(){var t,e,r;for(r="",t=e=1;36>=e;t=++e)r+=9===t||14===t||19===t||24===t?"-":15===t?"4":20===t?(Math.floor(4*Math.random())+8).toString(16):Math.floor(15*Math.random()).toString(16);return r}}).call(this),function(){e.Location=function(){function t(t){var e,r;null==t&&(t=""),r=document.createElement("a"),r.href=t.toString(),this.absoluteURL=r.href,e=r.hash.length,2>e?this.requestURL=this.absoluteURL:(this.requestURL=this.absoluteURL.slice(0,-e),this.anchor=r.hash.slice(1))}var e,r,n,o;return t.wrap=function(t){return t instanceof this?t:new this(t)},t.prototype.getOrigin=function(){return this.absoluteURL.split("/",3).join("/")},t.prototype.getPath=function(){var t,e;return null!=(t=null!=(e=this.requestURL.match(/\/\/[^\/]*(\/[^?;]*)/))?e[1]:void 0)?t:"/"},t.prototype.getPathComponents=function(){return this.getPath().split("/").slice(1)},t.prototype.getLastPathComponent=function(){return this.getPathComponents().slice(-1)[0]},t.prototype.getExtension=function(){var t,e;return null!=(t=null!=(e=this.getLastPathComponent().match(/\.[^.]*$/))?e[0]:void 0)?t:""},t.prototype.isHTML=function(){return this.getExtension().match(/^(?:|\.(?:htm|html|xhtml))$/)},t.prototype.isPrefixedBy=function(t){var e;return e=r(t),this.isEqualTo(t)||o(this.absoluteURL,e)},t.prototype.isEqualTo=function(t){return this.absoluteURL===(null!=t?t.absoluteURL:void 0)},t.prototype.toCacheKey=function(){return this.requestURL},t.prototype.toJSON=function(){return this.absoluteURL},t.prototype.toString=function(){return this.absoluteURL},t.prototype.valueOf=function(){return this.absoluteURL},r=function(t){return e(t.getOrigin()+t.getPath())},e=function(t){return n(t,"/")?t:t+"/"},o=function(t,e){return t.slice(0,e.length)===e},n=function(t,e){return t.slice(-e.length)===e},t}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};e.HttpRequest=function(){function r(r,n,o){this.delegate=r,this.requestCanceled=t(this.requestCanceled,this),this.requestTimedOut=t(this.requestTimedOut,this),this.requestFailed=t(this.requestFailed,this),this.requestLoaded=t(this.requestLoaded,this),this.requestProgressed=t(this.requestProgressed,this),this.url=e.Location.wrap(n).requestURL,this.referrer=e.Location.wrap(o).absoluteURL,this.createXHR()}return r.NETWORK_FAILURE=0,r.TIMEOUT_FAILURE=-1,r.timeout=60,r.prototype.send=function(){var t;return this.xhr&&!this.sent?(this.notifyApplicationBeforeRequestStart(),this.setProgress(0),this.xhr.send(),this.sent=!0,"function"==typeof(t=this.delegate).requestStarted?t.requestStarted():void 0):void 0},r.prototype.cancel=function(){return this.xhr&&this.sent?this.xhr.abort():void 0},r.prototype.requestProgressed=function(t){return t.lengthComputable?this.setProgress(t.loaded/t.total):void 0},r.prototype.requestLoaded=function(){return this.endRequest(function(t){return function(){var e;return 200<=(e=t.xhr.status)&&300>e?t.delegate.requestCompletedWithResponse(t.xhr.responseText,t.xhr.getResponseHeader("Turbolinks-Location")):(t.failed=!0,t.delegate.requestFailedWithStatusCode(t.xhr.status,t.xhr.responseText))}}(this))},r.prototype.requestFailed=function(){return this.endRequest(function(t){return function(){return t.failed=!0,t.delegate.requestFailedWithStatusCode(t.constructor.NETWORK_FAILURE)}}(this))},r.prototype.requestTimedOut=function(){return this.endRequest(function(t){return function(){return t.failed=!0,t.delegate.requestFailedWithStatusCode(t.constructor.TIMEOUT_FAILURE)}}(this))},r.prototype.requestCanceled=function(){return this.endRequest()},r.prototype.notifyApplicationBeforeRequestStart=function(){return e.dispatch("turbolinks:request-start",{data:{url:this.url,xhr:this.xhr}})},r.prototype.notifyApplicationAfterRequestEnd=function(){return e.dispatch("turbolinks:request-end",{data:{url:this.url,xhr:this.xhr}})},r.prototype.createXHR=function(){return this.xhr=new XMLHttpRequest,this.xhr.open("GET",this.url,!0),this.xhr.timeout=1e3*this.constructor.timeout,this.xhr.setRequestHeader("Accept","text/html, application/xhtml+xml"),this.xhr.setRequestHeader("Turbolinks-Referrer",this.referrer),this.xhr.onprogress=this.requestProgressed,this.xhr.onload=this.requestLoaded,this.xhr.onerror=this.requestFailed,this.xhr.ontimeout=this.requestTimedOut,this.xhr.onabort=this.requestCanceled},r.prototype.endRequest=function(t){return this.xhr?(this.notifyApplicationAfterRequestEnd(),null!=t&&t.call(this),this.destroy()):void 0},r.prototype.setProgress=function(t){var e;return this.progress=t,"function"==typeof(e=this.delegate).requestProgressed?e.requestProgressed(this.progress):void 0},r.prototype.destroy=function(){var t;return this.setProgress(1),"function"==typeof(t=this.delegate).requestFinished&&t.requestFinished(),this.delegate=null,this.xhr=null},r}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};e.ProgressBar=function(){function e(){this.trickle=t(this.trickle,this),this.stylesheetElement=this.createStylesheetElement(),this.progressElement=this.createProgressElement()}var r;return r=300,e.defaultCSS=".turbolinks-progress-bar {\n  position: fixed;\n  display: block;\n  top: 0;\n  left: 0;\n  height: 3px;\n  background: #0076ff;\n  z-index: 9999;\n  transition: width "+r+"ms ease-out, opacity "+r/2+"ms "+r/2+"ms ease-in;\n  transform: translate3d(0, 0, 0);\n}",e.prototype.show=function(){return this.visible?void 0:(this.visible=!0,this.installStylesheetElement(),this.installProgressElement(),this.startTrickling())},e.prototype.hide=function(){return this.visible&&!this.hiding?(this.hiding=!0,this.fadeProgressElement(function(t){return function(){return t.uninstallProgressElement(),t.stopTrickling(),t.visible=!1,t.hiding=!1}}(this))):void 0},e.prototype.setValue=function(t){return this.value=t,this.refresh()},e.prototype.installStylesheetElement=function(){return document.head.insertBefore(this.stylesheetElement,document.head.firstChild)},e.prototype.installProgressElement=function(){return this.progressElement.style.width=0,this.progressElement.style.opacity=1,document.documentElement.insertBefore(this.progressElement,document.body),this.refresh()},e.prototype.fadeProgressElement=function(t){return this.progressElement.style.opacity=0,setTimeout(t,1.5*r)},e.prototype.uninstallProgressElement=function(){return this.progressElement.parentNode?document.documentElement.removeChild(this.progressElement):void 0},e.prototype.startTrickling=function(){return null!=this.trickleInterval?this.trickleInterval:this.trickleInterval=setInterval(this.trickle,r)},e.prototype.stopTrickling=function(){return clearInterval(this.trickleInterval),this.trickleInterval=null},e.prototype.trickle=function(){return this.setValue(this.value+Math.random()/100)},e.prototype.refresh=function(){return requestAnimationFrame(function(t){return function(){return t.progressElement.style.width=10+90*t.value+"%"}}(this))},e.prototype.createStylesheetElement=function(){var t;return t=document.createElement("style"),t.type="text/css",t.textContent=this.constructor.defaultCSS,t},e.prototype.createProgressElement=function(){var t;return t=document.createElement("div"),t.className="turbolinks-progress-bar",t},e}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};e.BrowserAdapter=function(){function r(r){this.controller=r,this.showProgressBar=t(this.showProgressBar,this),this.progressBar=new e.ProgressBar}var n,o,i;return i=e.HttpRequest,n=i.NETWORK_FAILURE,o=i.TIMEOUT_FAILURE,r.prototype.visitProposedToLocationWithAction=function(t,e){return this.controller.startVisitToLocationWithAction(t,e)},r.prototype.visitStarted=function(t){return t.issueRequest(),t.changeHistory(),t.loadCachedSnapshot()},r.prototype.visitRequestStarted=function(t){return this.progressBar.setValue(0),t.hasCachedSnapshot()||"restore"!==t.action?this.showProgressBarAfterDelay():this.showProgressBar()},r.prototype.visitRequestProgressed=function(t){return this.progressBar.setValue(t.progress)},r.prototype.visitRequestCompleted=function(t){return t.loadResponse()},r.prototype.visitRequestFailedWithStatusCode=function(t,e){switch(e){case n:case o:return this.reload();default:return t.loadResponse()}},r.prototype.visitRequestFinished=function(t){return this.hideProgressBar()},r.prototype.visitCompleted=function(t){return t.followRedirect()},r.prototype.pageInvalidated=function(){return this.reload()},r.prototype.showProgressBarAfterDelay=function(){return this.progressBarTimeout=setTimeout(this.showProgressBar,this.controller.progressBarDelay)},r.prototype.showProgressBar=function(){return this.progressBar.show()},r.prototype.hideProgressBar=function(){return this.progressBar.hide(),clearTimeout(this.progressBarTimeout)},r.prototype.reload=function(){return window.location.reload()},r}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};e.History=function(){function r(e){this.delegate=e,this.onPageLoad=t(this.onPageLoad,this),this.onPopState=t(this.onPopState,this)}return r.prototype.start=function(){return this.started?void 0:(addEventListener("popstate",this.onPopState,!1),addEventListener("load",this.onPageLoad,!1),this.started=!0)},r.prototype.stop=function(){return this.started?(removeEventListener("popstate",this.onPopState,!1),removeEventListener("load",this.onPageLoad,!1),this.started=!1):void 0},r.prototype.push=function(t,r){return t=e.Location.wrap(t),this.update("push",t,r)},r.prototype.replace=function(t,r){return t=e.Location.wrap(t),this.update("replace",t,r)},r.prototype.onPopState=function(t){var r,n,o,i;return this.shouldHandlePopState()&&(i=null!=(n=t.state)?n.turbolinks:void 0)?(r=e.Location.wrap(window.location),o=i.restorationIdentifier,this.delegate.historyPoppedToLocationWithRestorationIdentifier(r,o)):void 0},r.prototype.onPageLoad=function(t){return e.defer(function(t){return function(){return t.pageLoaded=!0}}(this))},r.prototype.shouldHandlePopState=function(){return this.pageIsLoaded()},r.prototype.pageIsLoaded=function(){return this.pageLoaded||"complete"===document.readyState},r.prototype.update=function(t,e,r){var n;return n={turbolinks:{restorationIdentifier:r}},history[t+"State"](n,null,e)},r}()}.call(this),function(){e.HeadDetails=function(){function t(t){var e,r,n,s,a,u;for(this.elements={},n=0,a=t.length;a>n;n++)u=t[n],u.nodeType===Node.ELEMENT_NODE&&(s=u.outerHTML,r=null!=(e=this.elements)[s]?e[s]:e[s]={type:i(u),tracked:o(u),elements:[]},r.elements.push(u))}var e,r,n,o,i;return t.fromHeadElement=function(t){var e;return new this(null!=(e=null!=t?t.childNodes:void 0)?e:[])},t.prototype.hasElementWithKey=function(t){return t in this.elements},t.prototype.getTrackedElementSignature=function(){var t,e;return function(){var r,n;r=this.elements,n=[];for(t in r)e=r[t].tracked,e&&n.push(t);return n}.call(this).join("")},t.prototype.getScriptElementsNotInDetails=function(t){return this.getElementsMatchingTypeNotInDetails("script",t)},t.prototype.getStylesheetElementsNotInDetails=function(t){return this.getElementsMatchingTypeNotInDetails("stylesheet",t)},t.prototype.getElementsMatchingTypeNotInDetails=function(t,e){var r,n,o,i,s,a;o=this.elements,s=[];for(n in o)i=o[n],a=i.type,r=i.elements,a!==t||e.hasElementWithKey(n)||s.push(r[0]);return s},t.prototype.getProvisionalElements=function(){var t,e,r,n,o,i,s;r=[],n=this.elements;for(e in n)o=n[e],s=o.type,i=o.tracked,t=o.elements,null!=s||i?t.length>1&&r.push.apply(r,t.slice(1)):r.push.apply(r,t);return r},t.prototype.getMetaValue=function(t){var e;return null!=(e=this.findMetaElementByName(t))?e.getAttribute("content"):void 0},t.prototype.findMetaElementByName=function(t){var r,n,o,i;r=void 0,i=this.elements;for(o in i)n=i[o].elements,e(n[0],t)&&(r=n[0]);return r},i=function(t){return r(t)?"script":n(t)?"stylesheet":void 0},o=function(t){return"reload"===t.getAttribute("data-turbolinks-track")},r=function(t){var e;return e=t.tagName.toLowerCase(),"script"===e},n=function(t){var e;return e=t.tagName.toLowerCase(),"style"===e||"link"===e&&"stylesheet"===t.getAttribute("rel")},e=function(t,e){var r;return r=t.tagName.toLowerCase(),"meta"===r&&t.getAttribute("name")===e},t}()}.call(this),function(){e.Snapshot=function(){function t(t,e){this.headDetails=t,this.bodyElement=e}return t.wrap=function(t){return t instanceof this?t:"string"==typeof t?this.fromHTMLString(t):this.fromHTMLElement(t)},t.fromHTMLString=function(t){var e;return e=document.createElement("html"),e.innerHTML=t,this.fromHTMLElement(e)},t.fromHTMLElement=function(t){var r,n,o,i;return o=t.querySelector("head"),r=null!=(i=t.querySelector("body"))?i:document.createElement("body"),n=e.HeadDetails.fromHeadElement(o),new this(n,r)},t.prototype.clone=function(){return new this.constructor(this.headDetails,this.bodyElement.cloneNode(!0))},t.prototype.getRootLocation=function(){var t,r;return r=null!=(t=this.getSetting("root"))?t:"/",new e.Location(r)},t.prototype.getCacheControlValue=function(){return this.getSetting("cache-control")},t.prototype.getElementForAnchor=function(t){try{return this.bodyElement.querySelector("[id='"+t+"'], a[name='"+t+"']")}catch(e){}},t.prototype.getPermanentElements=function(){return this.bodyElement.querySelectorAll("[id][data-turbolinks-permanent]")},t.prototype.getPermanentElementById=function(t){return this.bodyElement.querySelector("#"+t+"[data-turbolinks-permanent]")},t.prototype.getPermanentElementsPresentInSnapshot=function(t){var e,r,n,o,i;for(o=this.getPermanentElements(),i=[],r=0,n=o.length;n>r;r++)e=o[r],t.getPermanentElementById(e.id)&&i.push(e);return i},t.prototype.findFirstAutofocusableElement=function(){return this.bodyElement.querySelector("[autofocus]")},t.prototype.hasAnchor=function(t){return null!=this.getElementForAnchor(t)},t.prototype.isPreviewable=function(){return"no-preview"!==this.getCacheControlValue()},t.prototype.isCacheable=function(){return"no-cache"!==this.getCacheControlValue()},t.prototype.isVisitable=function(){return"reload"!==this.getSetting("visit-control")},t.prototype.getSetting=function(t){return this.headDetails.getMetaValue("turbolinks-"+t)},t}()}.call(this),function(){var t=[].slice;e.Renderer=function(){function e(){}var r;return e.render=function(){var e,r,n,o;return n=arguments[0],r=arguments[1],e=3<=arguments.length?t.call(arguments,2):[],o=function(t,e,r){r.prototype=t.prototype;var n=new r,o=t.apply(n,e);return Object(o)===o?o:n}(this,e,function(){}),o.delegate=n,o.render(r),o},e.prototype.renderView=function(t){return this.delegate.viewWillRender(this.newBody),t(),this.delegate.viewRendered(this.newBody)},e.prototype.invalidateView=function(){return this.delegate.viewInvalidated()},e.prototype.createScriptElement=function(t){var e;return"false"===t.getAttribute("data-turbolinks-eval")?t:(e=document.createElement("script"),e.textContent=t.textContent,e.async=!1,r(e,t),e)},r=function(t,e){var r,n,o,i,s,a,u;for(i=e.attributes,a=[],r=0,n=i.length;n>r;r++)s=i[r],o=s.name,u=s.value,a.push(t.setAttribute(o,u));return a},e}()}.call(this),function(){var t,r,n=function(t,e){function r(){this.constructor=t}for(var n in e)o.call(e,n)&&(t[n]=e[n]);return r.prototype=e.prototype,t.prototype=new r,t.__super__=e.prototype,t},o={}.hasOwnProperty;e.SnapshotRenderer=function(e){function o(t,e,r){this.currentSnapshot=t,this.newSnapshot=e,this.isPreview=r,this.currentHeadDetails=this.currentSnapshot.headDetails,this.newHeadDetails=this.newSnapshot.headDetails,this.currentBody=this.currentSnapshot.bodyElement,this.newBody=this.newSnapshot.bodyElement}return n(o,e),o.prototype.render=function(t){return this.shouldRender()?(this.mergeHead(),this.renderView(function(e){return function(){return e.replaceBody(),e.isPreview||e.focusFirstAutofocusableElement(),t()}}(this))):this.invalidateView()},o.prototype.mergeHead=function(){return this.copyNewHeadStylesheetElements(),this.copyNewHeadScriptElements(),this.removeCurrentHeadProvisionalElements(),this.copyNewHeadProvisionalElements()},o.prototype.replaceBody=function(){var t;return t=this.relocateCurrentBodyPermanentElements(),this.activateNewBodyScriptElements(),this.assignNewBody(),this.replacePlaceholderElementsWithClonedPermanentElements(t)},o.prototype.shouldRender=function(){return this.newSnapshot.isVisitable()&&this.trackedElementsAreIdentical()},o.prototype.trackedElementsAreIdentical=function(){return this.currentHeadDetails.getTrackedElementSignature()===this.newHeadDetails.getTrackedElementSignature()},o.prototype.copyNewHeadStylesheetElements=function(){var t,e,r,n,o;for(n=this.getNewHeadStylesheetElements(),o=[],e=0,r=n.length;r>e;e++)t=n[e],o.push(document.head.appendChild(t));return o},o.prototype.copyNewHeadScriptElements=function(){var t,e,r,n,o;for(n=this.getNewHeadScriptElements(),o=[],e=0,r=n.length;r>e;e++)t=n[e],o.push(document.head.appendChild(this.createScriptElement(t)));return o},o.prototype.removeCurrentHeadProvisionalElements=function(){var t,e,r,n,o;for(n=this.getCurrentHeadProvisionalElements(),o=[],e=0,r=n.length;r>e;e++)t=n[e],o.push(document.head.removeChild(t));return o},o.prototype.copyNewHeadProvisionalElements=function(){var t,e,r,n,o;for(n=this.getNewHeadProvisionalElements(),o=[],e=0,r=n.length;r>e;e++)t=n[e],o.push(document.head.appendChild(t));return o},o.prototype.relocateCurrentBodyPermanentElements=function(){var e,n,o,i,s,a,u;for(a=this.getCurrentBodyPermanentElements(),u=[],e=0,n=a.length;n>e;e++)i=a[e],s=t(i),o=this.newSnapshot.getPermanentElementById(i.id),r(i,s.element),r(o,i),u.push(s);return u},o.prototype.replacePlaceholderElementsWithClonedPermanentElements=function(t){var e,n,o,i,s,a,u;for(u=[],o=0,i=t.length;i>o;o++)a=t[o],n=a.element,s=a.permanentElement,e=s.cloneNode(!0),u.push(r(n,e));return u},o.prototype.activateNewBodyScriptElements=function(){var t,e,n,o,i,s;for(i=this.getNewBodyScriptElements(),s=[],e=0,o=i.length;o>e;e++)n=i[e],t=this.createScriptElement(n),s.push(r(n,t));return s},o.prototype.assignNewBody=function(){return document.body=this.newBody},o.prototype.focusFirstAutofocusableElement=function(){var t;return null!=(t=this.newSnapshot.findFirstAutofocusableElement())?t.focus():void 0},o.prototype.getNewHeadStylesheetElements=function(){return this.newHeadDetails.getStylesheetElementsNotInDetails(this.currentHeadDetails)},o.prototype.getNewHeadScriptElements=function(){return this.newHeadDetails.getScriptElementsNotInDetails(this.currentHeadDetails)},o.prototype.getCurrentHeadProvisionalElements=function(){return this.currentHeadDetails.getProvisionalElements()},o.prototype.getNewHeadProvisionalElements=function(){return this.newHeadDetails.getProvisionalElements()},o.prototype.getCurrentBodyPermanentElements=function(){return this.currentSnapshot.getPermanentElementsPresentInSnapshot(this.newSnapshot)},o.prototype.getNewBodyScriptElements=function(){return this.newBody.querySelectorAll("script")},o}(e.Renderer),t=function(t){var e;return e=document.createElement("meta"),e.setAttribute("name","turbolinks-permanent-placeholder"),e.setAttribute("content",t.id),{element:e,permanentElement:t}},r=function(t,e){var r;return(r=t.parentNode)?r.replaceChild(e,t):void 0}}.call(this),function(){var t=function(t,e){function n(){this.constructor=t}for(var o in e)r.call(e,o)&&(t[o]=e[o]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t},r={}.hasOwnProperty;e.ErrorRenderer=function(e){function r(t){var e;e=document.createElement("html"),e.innerHTML=t,this.newHead=e.querySelector("head"),this.newBody=e.querySelector("body")}return t(r,e),r.prototype.render=function(t){return this.renderView(function(e){return function(){return e.replaceHeadAndBody(),e.activateBodyScriptElements(),t()}}(this))},r.prototype.replaceHeadAndBody=function(){var t,e;return e=document.head,t=document.body,e.parentNode.replaceChild(this.newHead,e),t.parentNode.replaceChild(this.newBody,t)},r.prototype.activateBodyScriptElements=function(){var t,e,r,n,o,i;for(n=this.getScriptElements(),i=[],e=0,r=n.length;r>e;e++)o=n[e],t=this.createScriptElement(o),i.push(o.parentNode.replaceChild(t,o));return i},r.prototype.getScriptElements=function(){return document.documentElement.querySelectorAll("script")},r}(e.Renderer)}.call(this),function(){e.View=function(){function t(t){this.delegate=t,this.htmlElement=document.documentElement}return t.prototype.getRootLocation=function(){return this.getSnapshot().getRootLocation()},t.prototype.getElementForAnchor=function(t){return this.getSnapshot().getElementForAnchor(t)},t.prototype.getSnapshot=function(){return e.Snapshot.fromHTMLElement(this.htmlElement)},t.prototype.render=function(t,e){var r,n,o;return o=t.snapshot,r=t.error,n=t.isPreview,this.markAsPreview(n),null!=o?this.renderSnapshot(o,n,e):this.renderError(r,e)},t.prototype.markAsPreview=function(t){return t?this.htmlElement.setAttribute("data-turbolinks-preview",""):this.htmlElement.removeAttribute("data-turbolinks-preview")},t.prototype.renderSnapshot=function(t,r,n){return e.SnapshotRenderer.render(this.delegate,n,this.getSnapshot(),e.Snapshot.wrap(t),r)},t.prototype.renderError=function(t,r){return e.ErrorRenderer.render(this.delegate,r,t)},t}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};e.ScrollManager=function(){function r(r){this.delegate=r,this.onScroll=t(this.onScroll,this),this.onScroll=e.throttle(this.onScroll)}return r.prototype.start=function(){return this.started?void 0:(addEventListener("scroll",this.onScroll,!1),this.onScroll(),this.started=!0)},r.prototype.stop=function(){return this.started?(removeEventListener("scroll",this.onScroll,!1),this.started=!1):void 0},r.prototype.scrollToElement=function(t){return t.scrollIntoView()},r.prototype.scrollToPosition=function(t){var e,r;return e=t.x,r=t.y,window.scrollTo(e,r)},r.prototype.onScroll=function(t){return this.updatePosition({x:window.pageXOffset,y:window.pageYOffset})},r.prototype.updatePosition=function(t){var e;return this.position=t,null!=(e=this.delegate)?e.scrollPositionChanged(this.position):void 0},r}()}.call(this),function(){e.SnapshotCache=function(){function t(t){this.size=t,this.keys=[],this.snapshots={}}var r;return t.prototype.has=function(t){var e;return e=r(t),e in this.snapshots},t.prototype.get=function(t){var e;if(this.has(t))return e=this.read(t),this.touch(t),e},t.prototype.put=function(t,e){return this.write(t,e),this.touch(t),e},t.prototype.read=function(t){var e;return e=r(t),this.snapshots[e]},t.prototype.write=function(t,e){var n;return n=r(t),this.snapshots[n]=e},t.prototype.touch=function(t){var e,n;return n=r(t),e=this.keys.indexOf(n),e>-1&&this.keys.splice(e,1),this.keys.unshift(n),this.trim()},t.prototype.trim=function(){var t,e,r,n,o;for(n=this.keys.splice(this.size),o=[],t=0,r=n.length;r>t;t++)e=n[t],o.push(delete this.snapshots[e]);return o},r=function(t){return e.Location.wrap(t).toCacheKey()},t}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};e.Visit=function(){function r(r,n,o){this.controller=r,this.action=o,this.performScroll=t(this.performScroll,this),this.identifier=e.uuid(),this.location=e.Location.wrap(n),this.adapter=this.controller.adapter,this.state="initialized",this.timingMetrics={}}var n;return r.prototype.start=function(){return"initialized"===this.state?(this.recordTimingMetric("visitStart"),this.state="started",this.adapter.visitStarted(this)):void 0},r.prototype.cancel=function(){var t;return"started"===this.state?(null!=(t=this.request)&&t.cancel(),this.cancelRender(),this.state="canceled"):void 0},r.prototype.complete=function(){var t;return"started"===this.state?(this.recordTimingMetric("visitEnd"),this.state="completed","function"==typeof(t=this.adapter).visitCompleted&&t.visitCompleted(this),this.controller.visitCompleted(this)):void 0},r.prototype.fail=function(){var t;return"started"===this.state?(this.state="failed","function"==typeof(t=this.adapter).visitFailed?t.visitFailed(this):void 0):void 0},r.prototype.changeHistory=function(){var t,e;return this.historyChanged?void 0:(t=this.location.isEqualTo(this.referrer)?"replace":this.action,e=n(t),this.controller[e](this.location,this.restorationIdentifier),this.historyChanged=!0)},r.prototype.issueRequest=function(){return this.shouldIssueRequest()&&null==this.request?(this.progress=0,this.request=new e.HttpRequest(this,this.location,this.referrer),this.request.send()):void 0},r.prototype.getCachedSnapshot=function(){var t;return!(t=this.controller.getCachedSnapshotForLocation(this.location))||null!=this.location.anchor&&!t.hasAnchor(this.location.anchor)||"restore"!==this.action&&!t.isPreviewable()?void 0:t},r.prototype.hasCachedSnapshot=function(){return null!=this.getCachedSnapshot()},r.prototype.loadCachedSnapshot=function(){var t,e;return(e=this.getCachedSnapshot())?(t=this.shouldIssueRequest(),this.render(function(){var r;return this.cacheSnapshot(),this.controller.render({snapshot:e,isPreview:t},this.performScroll),"function"==typeof(r=this.adapter).visitRendered&&r.visitRendered(this),t?void 0:this.complete()})):void 0},r.prototype.loadResponse=function(){return null!=this.response?this.render(function(){var t,e;return this.cacheSnapshot(),this.request.failed?(this.controller.render({error:this.response},this.performScroll),"function"==typeof(t=this.adapter).visitRendered&&t.visitRendered(this),this.fail()):(this.controller.render({snapshot:this.response},this.performScroll),"function"==typeof(e=this.adapter).visitRendered&&e.visitRendered(this),this.complete())}):void 0},r.prototype.followRedirect=function(){return this.redirectedToLocation&&!this.followedRedirect?(this.location=this.redirectedToLocation,this.controller.replaceHistoryWithLocationAndRestorationIdentifier(this.redirectedToLocation,this.restorationIdentifier),this.followedRedirect=!0):void 0},r.prototype.requestStarted=function(){var t;return this.recordTimingMetric("requestStart"),"function"==typeof(t=this.adapter).visitRequestStarted?t.visitRequestStarted(this):void 0},r.prototype.requestProgressed=function(t){var e;return this.progress=t,"function"==typeof(e=this.adapter).visitRequestProgressed?e.visitRequestProgressed(this):void 0},r.prototype.requestCompletedWithResponse=function(t,r){return this.response=t,null!=r&&(this.redirectedToLocation=e.Location.wrap(r)),this.adapter.visitRequestCompleted(this)},r.prototype.requestFailedWithStatusCode=function(t,e){return this.response=e,this.adapter.visitRequestFailedWithStatusCode(this,t)},r.prototype.requestFinished=function(){var t;return this.recordTimingMetric("requestEnd"),"function"==typeof(t=this.adapter).visitRequestFinished?t.visitRequestFinished(this):void 0},r.prototype.performScroll=function(){return this.scrolled?void 0:("restore"===this.action?this.scrollToRestoredPosition()||this.scrollToTop():this.scrollToAnchor()||this.scrollToTop(),this.scrolled=!0)},r.prototype.scrollToRestoredPosition=function(){var t,e;return t=null!=(e=this.restorationData)?e.scrollPosition:void 0,null!=t?(this.controller.scrollToPosition(t),!0):void 0},r.prototype.scrollToAnchor=function(){return null!=this.location.anchor?(this.controller.scrollToAnchor(this.location.anchor),!0):void 0},r.prototype.scrollToTop=function(){return this.controller.scrollToPosition({x:0,y:0})},r.prototype.recordTimingMetric=function(t){var e;return null!=(e=this.timingMetrics)[t]?e[t]:e[t]=(new Date).getTime()},r.prototype.getTimingMetrics=function(){return e.copyObject(this.timingMetrics)},n=function(t){switch(t){case"replace":return"replaceHistoryWithLocationAndRestorationIdentifier";case"advance":case"restore":return"pushHistoryWithLocationAndRestorationIdentifier"}},r.prototype.shouldIssueRequest=function(){return"restore"===this.action?!this.hasCachedSnapshot():!0},r.prototype.cacheSnapshot=function(){return this.snapshotCached?void 0:(this.controller.cacheSnapshot(),this.snapshotCached=!0)},r.prototype.render=function(t){return this.cancelRender(),this.frame=requestAnimationFrame(function(e){return function(){return e.frame=null,t.call(e)}}(this))},r.prototype.cancelRender=function(){return this.frame?cancelAnimationFrame(this.frame):void 0},r}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};e.Controller=function(){function r(){this.clickBubbled=t(this.clickBubbled,this),this.clickCaptured=t(this.clickCaptured,this),this.pageLoaded=t(this.pageLoaded,this),this.history=new e.History(this),this.view=new e.View(this),this.scrollManager=new e.ScrollManager(this),this.restorationData={},this.clearCache(),this.setProgressBarDelay(500)}return r.prototype.start=function(){return e.supported&&!this.started?(addEventListener("click",this.clickCaptured,!0),addEventListener("DOMContentLoaded",this.pageLoaded,!1),this.scrollManager.start(),this.startHistory(),this.started=!0,this.enabled=!0):void 0},r.prototype.disable=function(){return this.enabled=!1},r.prototype.stop=function(){return this.started?(removeEventListener("click",this.clickCaptured,!0),removeEventListener("DOMContentLoaded",this.pageLoaded,!1),this.scrollManager.stop(),this.stopHistory(),this.started=!1):void 0},r.prototype.clearCache=function(){return this.cache=new e.SnapshotCache(10)},r.prototype.visit=function(t,r){var n,o;return null==r&&(r={}),t=e.Location.wrap(t),this.applicationAllowsVisitingLocation(t)?this.locationIsVisitable(t)?(n=null!=(o=r.action)?o:"advance",this.adapter.visitProposedToLocationWithAction(t,n)):window.location=t:void 0},r.prototype.startVisitToLocationWithAction=function(t,r,n){var o;return e.supported?(o=this.getRestorationDataForIdentifier(n),this.startVisit(t,r,{restorationData:o})):window.location=t},r.prototype.setProgressBarDelay=function(t){return this.progressBarDelay=t},r.prototype.startHistory=function(){return this.location=e.Location.wrap(window.location),this.restorationIdentifier=e.uuid(),this.history.start(),this.history.replace(this.location,this.restorationIdentifier)},r.prototype.stopHistory=function(){return this.history.stop()},r.prototype.pushHistoryWithLocationAndRestorationIdentifier=function(t,r){return this.restorationIdentifier=r,this.location=e.Location.wrap(t),this.history.push(this.location,this.restorationIdentifier)},r.prototype.replaceHistoryWithLocationAndRestorationIdentifier=function(t,r){return this.restorationIdentifier=r,this.location=e.Location.wrap(t),this.history.replace(this.location,this.restorationIdentifier)},r.prototype.historyPoppedToLocationWithRestorationIdentifier=function(t,r){var n;return this.restorationIdentifier=r,this.enabled?(n=this.getRestorationDataForIdentifier(this.restorationIdentifier),this.startVisit(t,"restore",{restorationIdentifier:this.restorationIdentifier,restorationData:n,historyChanged:!0}),this.location=e.Location.wrap(t)):this.adapter.pageInvalidated()},r.prototype.getCachedSnapshotForLocation=function(t){var e;return null!=(e=this.cache.get(t))?e.clone():void 0},r.prototype.shouldCacheSnapshot=function(){return this.view.getSnapshot().isCacheable();
},r.prototype.cacheSnapshot=function(){var t,r;return this.shouldCacheSnapshot()?(this.notifyApplicationBeforeCachingSnapshot(),r=this.view.getSnapshot(),t=this.lastRenderedLocation,e.defer(function(e){return function(){return e.cache.put(t,r.clone())}}(this))):void 0},r.prototype.scrollToAnchor=function(t){var e;return(e=this.view.getElementForAnchor(t))?this.scrollToElement(e):this.scrollToPosition({x:0,y:0})},r.prototype.scrollToElement=function(t){return this.scrollManager.scrollToElement(t)},r.prototype.scrollToPosition=function(t){return this.scrollManager.scrollToPosition(t)},r.prototype.scrollPositionChanged=function(t){var e;return e=this.getCurrentRestorationData(),e.scrollPosition=t},r.prototype.render=function(t,e){return this.view.render(t,e)},r.prototype.viewInvalidated=function(){return this.adapter.pageInvalidated()},r.prototype.viewWillRender=function(t){return this.notifyApplicationBeforeRender(t)},r.prototype.viewRendered=function(){return this.lastRenderedLocation=this.currentVisit.location,this.notifyApplicationAfterRender()},r.prototype.pageLoaded=function(){return this.lastRenderedLocation=this.location,this.notifyApplicationAfterPageLoad()},r.prototype.clickCaptured=function(){return removeEventListener("click",this.clickBubbled,!1),addEventListener("click",this.clickBubbled,!1)},r.prototype.clickBubbled=function(t){var e,r,n;return this.enabled&&this.clickEventIsSignificant(t)&&(r=this.getVisitableLinkForNode(t.target))&&(n=this.getVisitableLocationForLink(r))&&this.applicationAllowsFollowingLinkToLocation(r,n)?(t.preventDefault(),e=this.getActionForLink(r),this.visit(n,{action:e})):void 0},r.prototype.applicationAllowsFollowingLinkToLocation=function(t,e){var r;return r=this.notifyApplicationAfterClickingLinkToLocation(t,e),!r.defaultPrevented},r.prototype.applicationAllowsVisitingLocation=function(t){var e;return e=this.notifyApplicationBeforeVisitingLocation(t),!e.defaultPrevented},r.prototype.notifyApplicationAfterClickingLinkToLocation=function(t,r){return e.dispatch("turbolinks:click",{target:t,data:{url:r.absoluteURL},cancelable:!0})},r.prototype.notifyApplicationBeforeVisitingLocation=function(t){return e.dispatch("turbolinks:before-visit",{data:{url:t.absoluteURL},cancelable:!0})},r.prototype.notifyApplicationAfterVisitingLocation=function(t){return e.dispatch("turbolinks:visit",{data:{url:t.absoluteURL}})},r.prototype.notifyApplicationBeforeCachingSnapshot=function(){return e.dispatch("turbolinks:before-cache")},r.prototype.notifyApplicationBeforeRender=function(t){return e.dispatch("turbolinks:before-render",{data:{newBody:t}})},r.prototype.notifyApplicationAfterRender=function(){return e.dispatch("turbolinks:render")},r.prototype.notifyApplicationAfterPageLoad=function(t){return null==t&&(t={}),e.dispatch("turbolinks:load",{data:{url:this.location.absoluteURL,timing:t}})},r.prototype.startVisit=function(t,e,r){var n;return null!=(n=this.currentVisit)&&n.cancel(),this.currentVisit=this.createVisit(t,e,r),this.currentVisit.start(),this.notifyApplicationAfterVisitingLocation(t)},r.prototype.createVisit=function(t,r,n){var o,i,s,a,u;return i=null!=n?n:{},a=i.restorationIdentifier,s=i.restorationData,o=i.historyChanged,u=new e.Visit(this,t,r),u.restorationIdentifier=null!=a?a:e.uuid(),u.restorationData=e.copyObject(s),u.historyChanged=o,u.referrer=this.location,u},r.prototype.visitCompleted=function(t){return this.notifyApplicationAfterPageLoad(t.getTimingMetrics())},r.prototype.clickEventIsSignificant=function(t){return!(t.defaultPrevented||t.target.isContentEditable||t.which>1||t.altKey||t.ctrlKey||t.metaKey||t.shiftKey)},r.prototype.getVisitableLinkForNode=function(t){return this.nodeIsVisitable(t)?e.closest(t,"a[href]:not([target]):not([download])"):void 0},r.prototype.getVisitableLocationForLink=function(t){var r;return r=new e.Location(t.getAttribute("href")),this.locationIsVisitable(r)?r:void 0},r.prototype.getActionForLink=function(t){var e;return null!=(e=t.getAttribute("data-turbolinks-action"))?e:"advance"},r.prototype.nodeIsVisitable=function(t){var r;return(r=e.closest(t,"[data-turbolinks]"))?"false"!==r.getAttribute("data-turbolinks"):!0},r.prototype.locationIsVisitable=function(t){return t.isPrefixedBy(this.view.getRootLocation())&&t.isHTML()},r.prototype.getCurrentRestorationData=function(){return this.getRestorationDataForIdentifier(this.restorationIdentifier)},r.prototype.getRestorationDataForIdentifier=function(t){var e;return null!=(e=this.restorationData)[t]?e[t]:e[t]={}},r}()}.call(this),function(){!function(){var t,e;if((t=e=document.currentScript)&&!e.hasAttribute("data-turbolinks-suppress-warning"))for(;t=t.parentNode;)if(t===document.body)return console.warn("You are loading Turbolinks from a <script> element inside the <body> element. This is probably not what you meant to do!\n\nLoad your application\u2019s JavaScript bundle inside the <head> element instead. <script> elements in <body> are evaluated with each page change.\n\nFor more information, see: https://github.com/turbolinks/turbolinks#working-with-script-elements\n\n\u2014\u2014\nSuppress this warning by adding a `data-turbolinks-suppress-warning` attribute to: %s",e.outerHTML)}()}.call(this),function(){var t,r,n;e.start=function(){return r()?(null==e.controller&&(e.controller=t()),e.controller.start()):void 0},r=function(){return null==window.Turbolinks&&(window.Turbolinks=e),n()},t=function(){var t;return t=new e.Controller,t.adapter=new e.BrowserAdapter(t),t},n=function(){return window.Turbolinks===e},n()&&e.start()}.call(this)}).call(this),"object"==typeof module&&module.exports?module.exports=e:"function"==typeof define&&define.amd&&define(e)}).call(this);
var directionsService;
var map = null;
var draw = null;
var infowindow;
var markerLive;
var route;
var stepSize = 0;
// var marker;
// var stmarker;
var showDirections = true;
var ACCESS_TOKEN = 'pk.eyJ1IjoiZ3Vsc2hhbmsiLCJhIjoiY2pvM3d1NGV3MTFydzN3cWlkZ2xjdmE1MSJ9.zQ1AATk2EOGJ4XMDyBV9vA';

function initMap() {
  
  // mapboxgl.accessToken = 'pk.eyJ1IjoiZ3Vsc2hhbmsiLCJhIjoiY2pvM3d1NGV3MTFydzN3cWlkZ2xjdmE1MSJ9.zQ1AATk2EOGJ4XMDyBV9vA';
  mapboxgl.accessToken = ACCESS_TOKEN
   var map = new mapboxgl.Map({
     container: 'mapid1', // HTML container id
     style: 'mapbox://styles/mapbox/streets-v9', // style URL
     center: [-96.3365,30.6185], // starting position as [lng, lat]
     zoom: 15
   });
   
}


function findMidPoint(start,end) {
  var lat1= start[1];
  var lon1= start[0];
  var lat2 = end[1];
  var lon2 = end[0];
  var dLon = (function (x) { return x * Math.PI / 180; })(lon2 - lon1);
  lat1 = (function (x) { return x * Math.PI / 180; })(lat1);
  lat2 = (function (x) { return x * Math.PI / 180; })(lat2);
  lon1 = (function (x) { return x * Math.PI / 180; })(lon1);
  var Bx = Math.cos(lat2) * Math.cos(dLon);
  var By = Math.cos(lat2) * Math.sin(dLon);
  var lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + Bx) * (Math.cos(lat1) + Bx) + By * By));
  var lon3 = lon1 + Math.atan2(By, Math.cos(lat1) + Bx);
  lat3 = lat3 * 180 / Math.PI;
  lon3 = lon3 * 180 / Math.PI;
  console.log("My lat long are:", lat3, lon3);
  return [lon3,lat3];
}


function initMapWithMarker(start, end, liveLocation) {
  
      console.log("in initMapwithMarker");
      var mapEl = $('#map');
      var optimized = mapEl.data('test-env'); //so that marker elements show up for testing
      // var myLatLng = {lat: lat, lng: lng};
     
      // mapboxgl.accessToken = 'pk.eyJ1IjoiZ3Vsc2hhbmsiLCJhIjoiY2pvM3d1NGV3MTFydzN3cWlkZ2xjdmE1MSJ9.zQ1AATk2EOGJ4XMDyBV9vA';
      mapboxgl.accessToken = ACCESS_TOKEN
      map = new mapboxgl.Map({
        container: 'mapid1', // HTML container id
        style: 'mapbox://styles/mapbox/streets-v9', // style URL
        center: findMidPoint(start,end),//[-96.3365,30.6185],
        //center: //[lat,lng], // starting position as [lng, lat]
        zoom: 14
      });
      
      //var start = [-96.340379, 30.620167]
      //var end = [-96.323706,30.609521]
      
      //var start = [-96.3409565,30.6189768];//start;
      //var end = [ -96.3425741,30.6213251];//end;
      console.log("travel time invoked from outside");
      // getTravelTime(start[1], start[0], end[1], end[0]);
      
      map.on('load', function() {
        getRoute(start,end);
      });

      function getRoute(start,end) {
        console.log("route enter");
        var directionsRequest = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + start[0] + ',' + start[1] + ';' + end[0] + ',' + end[1] + '?geometries=geojson&access_token=' + mapboxgl.accessToken;
        console.log(directionsRequest)
        $.ajax({
          method: 'GET',
          url: directionsRequest,
        }).done(function(data) {
            route = data.routes[0].geometry;
            var distancebtw = data.routes[0].distance*0.001*0.621371;//km to miles
            var durationbtw = data.routes[0].duration*60;
            var distDur = getDistanceDuration(start,end)
            console.log("distance is " + distancebtw);
            console.log("duration is " + durationbtw);
            if(distDur!=null){
              console.log("Live distance is " + distDur[0]);
              console.log("Live duration is " + distDur[1]);
            }
            document.getElementById('ETA').innerHTML = distancebtw;
            document.getElementById('ETT').innerHTML = durationbtw;
            
            if(route!=null && route.coordinates.length!=0){
            console.log("data " +route);
            console.log("data " + route.coordinates[0])
            console.log("fsdfsd"+route.coordinates.length);
            console.log("travel time invoked from outside");
            
            start = route.coordinates[0];
            if(markerLive!=null){
              markerLive.setLngLat(route.coordinates[1]);
            }
            end = route.coordinates[route.coordinates.length-1];
            console.log(route);
          }
          map.addLayer({
            id: 'route',
            type: 'line',
            source: {
              type: 'geojson',
              data: {
                type: 'Feature',
                geometry: route
              }
            },
            paint: {
              'line-width': 2
            }
          });
          // this is where the code from the next step will go
          var message = null;
          if(start!=null){
            strtMessage = "Start:"+"HRBB"
            strtAddress = "Harvey R. \"Bum\" Bright Building, College Station, TX 77840..";
          }
          if(end!=null){
            endMessage = "End:"+"ZACH"
            endAddress = "Zachry Engineering Education Complex, College Station, TX 77840..";
          }
          var contentStartString = '<h5>'+strtMessage+"</h5>"
          contentStartString = contentStartString + "<p>Details : "+strtAddress+"</p>"
          var contenEndString = '<h5>'+endMessage+"</h5>"
          contenEndString = contenEndString + "<p>Details : "+strtAddress+"</p>"
          
          var popStart = new mapboxgl.Popup().setHTML(contentStartString);
          var popEnd = new mapboxgl.Popup().setHTML(contenEndString);
          
          // var myNewIcon = map.icon({
          //     iconUrl: '../../stylesheets/images/mapbox-icon.png'
          // });  
          
          var geojson = {
              "type": "FeatureCollection",
              "features": [
                  {
                      "type": "Feature",
                      "properties": {
                          "iconSize": [15, 15]
                      }
                  }
              ]
          };
          // var geojson = {
          //       "type": "circle",
          //       "features": [
          //           {
          //               "type": "Feature",
          //               "properties": {
          //                   width: 30px,
          //                   height: 22px,
          //                   icon: {
          //                     iconUrl: '/images/cart2.png',
          //                     iconSize: [30, 22], // size of the icon
          //                     iconAnchor: [15, 15], // point of the icon which will correspond to marker's location
          //                     className: 'dot'  
          //                   }
          //               }
          //           }
          //       ]
          //   };
          // var marker2 = geojson.features[0];
          // var e1 = document.createElement('div');
          // e1.className = 'marker';
          // e1.style.backgroundImage = 'images/mapbox-icon.png';
          // e1.style.width = marker.properties.iconSize[0] + 'px';
          // e1.style.height = marker.properties.iconSize[1] + 'px';
      
          // // e1.addEventListener('click', function() {
          // //     window.alert(marker.properties.message);
          // // });
          
          var startDiv = document.createElement('div');
          startDiv.className = 'markerStart';
          var endDiv = document.createElement('div');
          endDiv.className = 'markerEnd';
          var liveDiv = document.createElement('div');
          liveDiv.className = 'markerLive';
      
          
          
          // var e3 = document.createElement('div');
          // e3.className = 'marker';
          // e3.style.backgroundImage = 'images/cart.png';
          // e3.style.width = marker.properties.iconSize[0] + 'px';
          // e3.style.height = marker.properties.iconSize[1] + 'px';
          
          var markerStart = new mapboxgl.Marker(startDiv)
                .setLngLat(start)
                .setPopup(popStart)
                .addTo(map);
          var markerEnd = new mapboxgl.Marker(endDiv)
                .setLngLat(end)
                .setPopup(popEnd)
                .addTo(map);
          markerLive = new mapboxgl.Marker(liveDiv)
                .setLngLat(liveLocation)
                .addTo(map);
          
        }).always(function(){
                    // map.addLayer({
                    //   id: 'start',
                    //   type: 'circle',
                    //   source: {
                    //     type: 'geojson',
                    //     data: {
                    //       type: 'Feature',
                    //       geometry: {
                    //         type: 'Point',
                    //         coordinates: start
                    //       }
                    //     }
                    //   }
                      
                    // });
                    // map.setPaintProperty('start', 'fill-color', '#ff0000');
                    // map.addLayer({
                    //   id: 'end',
                    //   type: 'circle',
                    //   source: {
                    //     type: 'geojson',
                    //     data: {
                    //       type: 'Feature',
                    //       geometry: {
                    //         type: 'Point',
                    //         coordinates: end
                    //       }
                    //     }
                    //   }
                    // });
                    // map.setPaintProperty('end', 'fill-color', '#ff0000');
        });
      }
      setInterval(function(){
        console.log("Hello");
        if(markerLive!= null && stepSize<route.coordinates.length){
          console.log("Iteration "+stepSize);
          console.log("Coordinates:"+route.coordinates[stepSize])
          markerLive.setLngLat(route.coordinates[stepSize++]);
          console.log("Change");
        }
      }, 3000);
      console.log("Hi!!!");
}    

function removeDirections() {
  // directionsDisplay.setMap(null);
}
function calcRoute(lat, lng) {
  // if (showDirections == false) {
  //   showDirections = !showDirections;
  //   directionsDisplay.setMap(null);
  //   return;
  // }
  
 
  // var start = {
  //   lat: 0,
  //   lng: 0
  // };
  
  // if (navigator.geolocation) {
  //   directionsDisplay.setMap(map)
  //   navigator.geolocation.getCurrentPosition(function(position) {
  //     start = {
  //       lat: position.coords.latitude,
  //       lng: position.coords.longitude
  //       };
        
  //       var end = {
  //           lat: lat,
  //           lng: lng
  //       };

  //       var request = {
  //         origin: start,
  //         destination: end,
  //         travelMode: 'WALKING'
  //       };
  //       directionsService.route(request, function(result, status) {
  //         if (status == 'OK') {
  //           directionsDisplay.setDirections(result);
  //             stmarker = new google.maps.Marker({
  //             position: start,
  //             map: map,
  //             icon: '/if_Star_Gold_1398915.png',
  //             optimized: false
  //           });
  //           infowindow.close()
  //         }
  //       });
        
  //     }, function() {
  //           alert('Directions to pickup point not available');
  //         });
  // } 
  // else {
  //   alert("Directions to pickup point not available")
  // }
  // showDirections = !showDirections;
  
}


function calculateAndDisplayRoute(request, startPointName, endPointName, routeId) {
//   initMap();
//   selectRoute(startPointName + " to " + endPointName);
//   var directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
//   directionsDisplay.setMap(map);
//   var startPoint;
//   var endPoint;

// 	var service_callback = function(response, status) {
// 		if (status === 'OK') {
// 			directionsDisplay.setDirections(response);
// 		} else {
// 			window.alert('Directions request failed due to ' + status);
// 		}
// 	}
  
//   //var jsonData = JSON.parse(request);
// 	for (var i = 0, parts = [], max = 22; i < request.length; i = i+max) {
// 		parts.push(request.slice(i, i + max + 1));
// 	}
	
// 	startPoint = new google.maps.LatLng(parseFloat(parts[0][0].lat), parseFloat(parts[0][0].lng));
	
//     var startMark = new google.maps.Marker({
//       position: startPoint,
//       map: map,
//       title: startPointName,
//       icon: '/if_Star_Gold_1398915.png'
//     });
    
//     var startInfo = new google.maps.InfoWindow({
//       content: '<h4>' + startPointName + '</h4>',
//       maxWidth: 250
//     });
//     startMark.addListener('mouseover', function() {
//       startInfo.open(map, startMark);
//     });
    
//     endPoint = new google.maps.LatLng(parseFloat(parts[0][parts[0].length-1].lat), parseFloat(parts[0][parts[0].length-1].lng))
    
//     //add marker at end point
//     var endMark = new google.maps.Marker({
//       position: endPoint,
//       map: map,
//       title: endPointName,
//     });
//     var endInfo = new google.maps.InfoWindow({
//       content: '<h4>' + endPointName + '</h4>',
//       maxWidth: 250
//     });
//     endMark.addListener('mouseover', function() {
//       endInfo.open(map, endMark);
//     });
    
//   for (var i = 0; i < parts.length; i++) {
// 		var waypts = [];
// 		for (var j = 0; j < parts[i].length - 1; j++) {
// 			waypts.push({
// 				location : new google.maps.LatLng(parseFloat(parts[i][j].lat), parseFloat(parts[i][j].lng)),
// 				stopover : false
// 			});
// 		}
// 		//alert(parts[i][parts[i].length-1].lat)
// 		var service_opts = {
// 			origin: new google.maps.LatLng(parseFloat(parts[i][0].lat), parseFloat(parts[i][0].lng)),
// 			destination: new google.maps.LatLng(parseFloat(parts[i][parts[i].length-1].lat), parseFloat(parts[i][parts[i].length-1].lng)),
// 			waypoints: waypts,
// 			optimizeWaypoints: true,
// 			travelMode: 'WALKING'
// 		};
// 		directionsService.route(service_opts, service_callback);
// 	}
//delete this comment
}

function selectRoute(route) {
	$('#selectedRoute').text(route);
}

// function getCartLiveLoc(){q
  
// }

// function getTravelTime(startGPSLat, startGPSLon,endGPSLat, endGPSLon){
//   console.log("travel time invoked")
//   startGPS = [startGPSLat,startGPSLon];
//   console.log("travel time invoked2")
//   endGPS = [endGPSLat,endGPSLon];
//   console.log("travel time invoked3")
//   listOfPoints = startGPS + ";" + endGPS;
//   pointList = new ArrayList<>();
//   console.log("travel time invoked4")
//   var directionsMatrixClient = MapboxMatrix.builder()
//     .accessToken('pk.eyJ1IjoiZ3Vsc2hhbmsiLCJhIjoiY2pvM3d1NGV3MTFydzN3cWlkZ2xjdmE1MSJ9.zQ1AATk2EOGJ4XMDyBV9vA')
//     .profile(DirectionsCriteria.PROFILE_DRIVING)
//     .coordinates(listOfPoints)
//     .build()
       
//     //console.log( "My travel times are:", directionsMatrixClient[0][0], directionsMatrixClient[0][1], directionsMatrixClient[1][0], directionsMatrixClient[1][1])
// }

// // function calculateDistance(strtLat, strtLong, endLat, endLong){
 
// // }


// function calculateEstimatedArrival(startGPSLat, startGPSLon){
//   // getTravelTime()
// }

// //Public API
// function plotMap( start_id, end_id){
  
// }
// function getClosestVehicleCartID(start_id){
  
// }
// function getVehicleGPS(cart_id){
  
// }


// Manvitha changes 


function mockCoordinates(){
  console.log("mock invoked");
  var Lat = [30.6211, 30.6102, 30.6123, 30.6213251, 30.609521];
  var Long = [-96.3404, -96.3410, -96.3413, -96.3425741, -96.323706];
  var i;
 
    for (i = 0; i < Lat.length-1; i++) {
      updateRoute([Long[i],Lat[i]], [Long[i+1],Lat[i+1]])
    } 

  
}


function updateRoute(source, destination) {
  console.log("invoked update route");
  removeRoute(); // overwrite any existing layers
  var data = draw.getAll();
  var answer = document.getElementById('calculated-line');
  /*
  var lastFeature = data.features.length - 1;
  var coords = data.features[lastFeature].geometry.coordinates;
  var newCoords = coords.join(';')
  console.log("newCoords are " + newCoords);*/
  var newCoords = source[0]+','+source[1]+';'+destination[0]+','+destination[1];
   console.log("newCoords are " + newCoords);
  //var newCoords = "-96.340379,30.620167;-96.323706,30.609521";
   
   setTimeout(getMatch, 10000, newCoords);
  //getMatch(newCoords);
}

function removeRoute () {
  console.log("invoked remove route");
  if (map.getSource('route')) {
    map.removeLayer('route');
    map.removeSource('route');
    document.getElementById('calculated-line').innerHTML = '';
    console.log("found route and deleted");
  } else  {
    console.log("no route found");
    return;
  }
  
}

function getDistanceDuration(start, end){
    var e = start[0] +","+start[1] +";" + end[0] + "," + end[1];
    mapboxgl.accessToken = ACCESS_TOKEN
    var url = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + e +'?geometries=geojson&steps=true&&access_token=' + mapboxgl.accessToken;
    var req = new XMLHttpRequest();
    req.responseType = 'json';
    req.open('GET', url, true);
    req.onload  = function() {
      var jsonResponse = req.response;
      var distance = jsonResponse.routes[0].distance*0.001*0.621371; // convert to km
      var duration = jsonResponse.routes[0].duration/60; // convert to minutes
      return [distance,duration];
    };
    var data = req.send();
    return data;
}



function getMatch(e) {
    // https://www.mapbox.com/api-documentation/#directions
    console.log("match route invoked");
    mapboxgl.accessToken = ACCESS_TOKEN
    var directionsRequest = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + e +'?geometries=geojson&steps=true&&access_token=' + mapboxgl.accessToken;
    
    $.ajax({
          method: 'GET',
          url: directionsRequest,
        }).done(function(data) {
            var geo = data.routes[0].geometry;
            //addRoute(geo);
            var distancebtw = data.routes[0].distance*0.001;
            var durationbtw = data.routes[0].duration*60;
            
            console.log("distance is " + distancebtw);
            console.log("duration is " + durationbtw);
            
            var route = geo;
            if(geo!=null && geo.coordinates.length!=0){
              start = geo.coordinates[0];
              end = geo.coordinates[geo.coordinates.length-1];
              // setTimeout(addRoute(geo), 10000);
              
                setTimeout(getMatch(e), 10000);
              
          }
        })
}
    
function abc(){
  console.log("hello hello");
}
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    /*
    var req = new XMLHttpRequest();
    req.responseType = 'json';
    req.open('GET', url, true);
    console.log('received json data ' + req.response)
    
   
    req.onload  = function() {
      var jsonResponse = req.response;
      var distance = jsonResponse.routes[0].distance*0.001*0.621371; // convert to km
      var duration = jsonResponse.routes[0].duration/60; // convert to minutes
      console.log("distance is " + distance)
      console.log("duration is " + duration)
      // add results to info box
      document.getElementById('calculated-line').innerHTML = 'Distance: ' + distance.toFixed(2) + ' mi<br>Duration: ' + duration.toFixed(2) + ' minutes';
      var coords = jsonResponse.routes[0].geometry;
      // add the route to the map
      
      
      addRoute(coords);
    };
    
    req.send();
     setTimeout(function() {
        console.log("timeout");
      }, 10000);
    
}*/


function addRoute (coords) {
  // check if the route is already loaded
  
  console.log('route addition has been invoked ');
  
  if (map.getSource('route')) {
    console.log("In add route if part");
    map.removeLayer('route')
    map.removeSource('route')
  }
  /*else*/{
    map.addLayer({
      "id": "route",
      "type": "line",
      "source": {
        "type": "geojson",
        "data": {
          "type": "Feature",
          "properties": {},
          "geometry": coords
        }
      },
      "layout": {
        "line-join": "round",
        "line-cap": "round"
      },
      "paint": {
        "line-color": "#3b9ddd",
        "line-width": 8,
        "line-opacity": 0.8
      }
    });
    console.log("before markers " + coords[0] + ',' + coords[1]);
    var el = document.createElement('div');
      el.className = 'marker';
      
    var start = [-96.340379, 30.620167]
    var end = [-96.323706,30.609521]
    
    var message = null;
    if(start!=null){
      strtMessage = "Start:"+"HRBB"
      strtAddress = "Harvey R. \"Bum\" Bright Building, College Station, TX 77840..";
    }
    if(end!=null){
      endMessage = "End:"+"ZACH"
      endAddress = "Zachry Engineering Education Complex, College Station, TX 77840..";
    }
    var contentStartString = '<h5>'+strtMessage+"</h5>"
    contentStartString = contentStartString + "<p>Details : "+strtAddress+"</p>"
    var contenEndString = '<h5>'+endMessage+"</h5>"
    contenEndString = contenEndString + "<p>Details : "+strtAddress+"</p>"
    
    var popStart = new mapboxgl.Popup().setHTML(contentStartString);
    var popEnd = new mapboxgl.Popup().setHTML(contenEndString);
    
    // var markerStart = new mapboxgl.Marker()
    //       .setLngLat(start)
    //       .setPopup(popStart)
    //       .addTo(map);
          

    // var markerEnd = new mapboxgl.Marker()
    //       .setLngLat(end)
    //       .setPopup(popEnd)
    //       .addTo(map);
          
        
    
   /*
     var el = document.createElement('div');
      el.className = 'marker';
      
       var markerStart = new mapboxgl.Marker()
                .setLngLat([-96.340379, 30.620167])
                .setPopup(new mapboxgl.Popup({ offset: 25 }))
                .addTo(map);
    
    
    console.log("marker prop " + marker.geometry.coordinates)
    var mar = new mapboxgl.Marker()
  .setLngLat([-96.340379, 30.620167])
  .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
  .setHTML('<h3>hello</h3>')
  .addTo(map)*/
  
  }
}

function reload(){
  window.location.reload(true);
}






function newInitMapWithMarker() {
      
      console.log("in new initMapwithMarker");
      mapboxgl.accessToken = ACCESS_TOKEN
      map = new mapboxgl.Map({
        container: 'mapid1',
        style: 'mapbox://styles/mapbox/streets-v9', 
        center: [-96.3365,30.6185],
        zoom: 15,
        minZoom: 11
      });
      
      console.log("map is " + map);
      
      
      draw = new MapboxDraw({
          displayControlsDefault: false,
          controls: {
              line_string: true,
              trash: true
      },
      styles: [
        {
            "id": "gl-draw-line",
            "type": "line",
            "filter": ["all", ["==", "$type", "LineString"], ["!=", "mode", "static"]],
            "layout": {
              "line-cap": "round",
              "line-join": "round"
            },
            "paint": {
              "line-color": "#5184e1",
              "line-dasharray": [0.2, 2],
              "line-width": 4,
              "line-opacity": 0.7
            }
        },
        // vertex point halos
        {
          "id": "gl-draw-polygon-and-line-vertex-halo-active",
          "type": "circle",
          "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
          "paint": {
            "circle-radius": 10,
            "circle-color": "#FFF"
          }
        },
        // vertex points
        {
          "id": "gl-draw-polygon-and-line-vertex-active",
          "type": "circle",
          "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
          "paint": {
            "circle-radius": 6,
            "circle-color": "#3b9ddd",
          }
        },
      ]
});
console.log("problem arose after this");
map.addControl(draw);
console.log("control has been added");
//map.on('draw.create', updateRoute);
//map.on('draw.update', updateRoute);
//map.on('draw.delete', removeRoute);
    
}    

//Manvitha changes
;
var map = null;
var markerLive;
var route;
var stepSize = 0;
var ACCESS_TOKEN = 'pk.eyJ1IjoiZ3Vsc2hhbmsiLCJhIjoiY2pvM3d1NGV3MTFydzN3cWlkZ2xjdmE1MSJ9.zQ1AATk2EOGJ4XMDyBV9vA';
var booked = false;
var started = false;
var vehicleId = "";

function initMap() {
    mapboxgl.accessToken = ACCESS_TOKEN
    var map = new mapboxgl.Map({
        container: 'mapid1', // HTML container id
        style: 'mapbox://styles/mapbox/streets-v9', // style URL
        center: [-96.3365,30.6185], // starting position as [lng, lat]
        zoom: 15
    });

}


function findMidPoint(start,end) {
    var lat1= start[1];
    var lon1= start[0];
    var lat2 = end[1];
    var lon2 = end[0];
    var dLon = (function (x) { return x * Math.PI / 180; })(lon2 - lon1);
    lat1 = (function (x) { return x * Math.PI / 180; })(lat1);
    lat2 = (function (x) { return x * Math.PI / 180; })(lat2);
    lon1 = (function (x) { return x * Math.PI / 180; })(lon1);
    var Bx = Math.cos(lat2) * Math.cos(dLon);
    var By = Math.cos(lat2) * Math.sin(dLon);
    var lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + Bx) * (Math.cos(lat1) + Bx) + By * By));
    var lon3 = lon1 + Math.atan2(By, Math.cos(lat1) + Bx);
    lat3 = lat3 * 180 / Math.PI;
    lon3 = lon3 * 180 / Math.PI;
    console.log("My lat long are:", lat3, lon3);
    return [lon3,lat3];
}

function initMapMarkerCart3(start,end){
    var getNearestVehicleUrl = 'https://tamuber-mock-server.herokuapp.com/api/vehicles/nearest?lattitude='+ start[1]+'&longitude='+start[0];
    $.ajax({
        method: 'GET',
        url: getNearestVehicleUrl,
        error: function() {
            console.log('No vehicles nearby...');
        }
    }).done(function(nearestVehicle) {
        if(nearestVehicle == null){
            return;
        }
        var nearLong = nearestVehicle.currentLocation.longitude;
        var nearLat = nearestVehicle.currentLocation.lattitude;
        var nearLoc = [nearLong,nearLat];
        var nearId = nearestVehicle.id;
        vehicleId = nearId;
        initMapMarkerCart(start,end,nearLoc,nearId)
        // var fetchLiveUrl = 'https://api.myjson.com/bins/o0td6';
        // // 'https://jsonbin.io/5c03821b1deea01014bbb72f';
        // //'http://tamuber-mock-server.herokuapp.com/api/vehicles/'+vehicleId;
        /*var fetchLiveUrl = 'https://raw.githubusercontent.com/rohan54/tamuber-students/master/myjson.json';
        $.getJSON(fetchLiveUrl, function(vehicle){
            // vehicle = JSON.parse(vehicle);
            console.log("vehicle");
            console.log(vehicle);
            var liveLong = vehicle.currentLocation.longitude;
            var liveLat = vehicle.currentLocation.lattitude;
            var liveLoc = [liveLong,liveLat];
            var liveId = vehicle.id;
            initMapMarkerCart(start,end,liveLoc,nearId)
        }).always(function(){
        });*/
    });
}




function initMapMarkerCart2(start,end,vehicleId){
    // var fetchLiveUrl = 'https://api.myjson.com/bins/o0td6';
    // // 'https://jsonbin.io/5c03821b1deea01014bbb72f';
    // //'http://tamuber-mock-server.herokuapp.com/api/vehicles/'+vehicleId;
    var fetchLiveUrl = 'https://raw.githubusercontent.com/rohan54/tamuber-students/master/myjson.json';
    var getNearestVehicleUrl = 'https://tamuber-mock-server.herokuapp.com/api/vehicles/nearest?lattitude='+ start[1]+'&longitude='+start[0];
    $.ajax({
        method: 'GET',
        url: getNearestVehicleUrl
    }).success(function(vehicle){
    // $.getJSON(fetchLiveUrl, function(vehicle) {
        console.log("vehicle");
        console.log(vehicle);
        var liveLong = vehicle.currentLocation.longitude;
        var liveLat = vehicle.currentLocation.lattitude;
        var liveLoc = [liveLong,liveLat];
        var liveId = vehicle.id;
        initMapMarkerCart(start,end,liveLoc,liveId)
    }).error(function(){
        console.log('No vehicles nearby...');
    }).
    always(function(){});
}

function initMapMarkerCart(start, end, liveLocation, liveVehicleId) {

    console.log("in initMapwithMarker");
    var mapEl = $('#map');
    var optimized = mapEl.data('test-env');
    mapboxgl.accessToken = ACCESS_TOKEN
    map = new mapboxgl.Map({
        container: 'mapid1', // HTML container id
        style: 'mapbox://styles/mapbox/streets-v9', // style URL
        center: findMidPoint(start,end),
        zoom: 14
    });

    console.log("travel time invoked from outside");
    document.getElementById('CARD').innerHTML = liveVehicleId;

    map.on('load', function() {
        getRoute(start,end,liveLocation);
    });

    function getRoute(start,end,liveLocation) {
        console.log("route enter");
        var directionsRequest = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + start[0] + ',' + start[1] + ';' + end[0] + ',' + end[1] + '?geometries=geojson&access_token=' + mapboxgl.accessToken;
        console.log(directionsRequest)
        $.ajax({
            method: 'GET',
            url: directionsRequest,
        }).done(function(data) {
            route = data.routes[0].geometry;
            updateETT(data);
            updateEstimatedTimes(liveLocation, start, 'ETA');

            if(route!=null && route.coordinates.length!=0){
                console.log("data " +route);
                console.log("data " + route.coordinates[0])
                console.log("fsdfsd"+route.coordinates.length);
                console.log("travel time invoked from outside");

                start = route.coordinates[0];
                end = route.coordinates[route.coordinates.length-1];
                if(markerLive!=null){
                    // markerLive.setLngLat(route.coordinates[1]);
                    markerLive.setLngLat(liveLocation);
                }
                console.log(route);
            }
            map.addLayer({
                id: 'route',
                type: 'line',
                source: {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        geometry: route
                    }
                },
                paint: {
                    'line-width': 2
                }
            });
            // this is where the code from the next step will go
            addMarkers(start, end, liveLocation);

        }).always(function(){
        });
    }
    setInterval(function(){
        console.log("Hello");
        if(markerLive!= null && stepSize<route.coordinates.length){
            // markerLive.setLngLat(route.coordinates[stepSize++]);
            var fetchLiveUrl = 'https://tamuber-mock-server.herokuapp.com/api/vehicles/'+liveVehicleId;
            // var fetchLiveUrl = //'https://raw.githubusercontent.com/rohan54/tamuber-students/master/myjson.json';
            console.log("--------Iteration "+stepSize+" Coordinates:"+route.coordinates);
            $.ajax({
                method: 'GET',
                url: fetchLiveUrl,
                error: function () {
                    console.log("Couldn't receive Live coordinates for vehicle:"+liveVehicleId);
                }
            }).success(function(vehicle) {
            // $.getJSON(fetchLiveUrl, function(vehicle) {
                if(vehicle.isAvailable != true){
                    var liveLong = vehicle.currentLocation.longitude;
                    var liveLat = vehicle.currentLocation.lattitude;
                    var liveLoc = [liveLong,liveLat];
                    console.log("Coordinates inside:"+liveLoc);
                    markerLive.setLngLat(liveLoc);
                    if(liveLoc == start){
                        started = true;
                    }
                    if(!started){
                        updateEstimatedTimes(liveLoc, start, 'ETA');
                    }
                    if(booked) {
                        updateEstimatedTimes(liveLoc, end, 'ETT');
                    }
                }
            });
            console.log("Change");
        }
    }, 3000);
    console.log("Hi!!!");
}

function updateTripTimeById(dist,time,id) {
    console.log(id+"distance is " + dist);
    console.log(id+"duration is " + time);
    document.getElementById(id).innerHTML = time + " minutes";
}

function updateEstimatedTimes(liveLocation, start, labelId) {
    if(liveLocation!=null && start!=null){
        getDistanceDuration(liveLocation, start,updateTripTimeById, labelId);
    } else{
        console.log(labelId + " cant be updated");
        console.log("liveLoc :"+liveLocation);
        console.log("start :"+start);
    }
}

function updateETT(data) {
    if(data!=null) {
        var dist = (data.routes[0].distance * 0.001 * 0.621371).toFixed(2);//km to miles
        var time = (data.routes[0].duration / 60).toFixed(2);
        updateTripTimeById(dist, time, 'ETT');
    } else{
        console.log("ETT cant be updated. data is null");
    }
}

function addMarkers(start, end, liveLocation) {
    var message = null;
    if (start != null) {
        var strtMessage = "Start:" + "HRBB"
        var strtAddress = "Harvey R. \"Bum\" Bright Building, College Station, TX 77840..";
    }
    if (end != null) {
        var endMessage = "End:" + "ZACH"
        var endAddress = "Zachry Engineering Education Complex, College Station, TX 77840..";
    }
    var contentStartString = '<h5>' + strtMessage + "</h5>"
    contentStartString = contentStartString + "<p>Details : " + strtAddress + "</p>"
    var contenEndString = '<h5>' + endMessage + "</h5>"
    contenEndString = contenEndString + "<p>Details : " + strtAddress + "</p>"

    var popStart = new mapboxgl.Popup().setHTML(contentStartString);
    var popEnd = new mapboxgl.Popup().setHTML(contenEndString);

    var geojson = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {
                    "iconSize": [15, 15]
                }
            }
        ]
    };

    var startDiv = document.createElement('div');
    startDiv.className = 'markerStart';
    var endDiv = document.createElement('div');
    endDiv.className = 'markerEnd';
    var liveDiv = document.createElement('div');
    liveDiv.className = 'markerLive';

    var markerStart = new mapboxgl.Marker(startDiv)
        .setLngLat(start)
        .setPopup(popStart)
        .addTo(map);
    var markerEnd = new mapboxgl.Marker(endDiv)
        .setLngLat(end)
        .setPopup(popEnd)
        .addTo(map);
    markerLive = new mapboxgl.Marker(liveDiv)
        .setLngLat(liveLocation)
        .addTo(map);
}

function calcRoute(lat, lng) {
}


function calculateAndDisplayRoute(request, startPointName, endPointName, routeId) {
}

function getDistanceDuration(start, end, updateFunction, labelId){
    var e = start[0] +","+start[1] +";" + end[0] + "," + end[1];
    mapboxgl.accessToken = ACCESS_TOKEN
    var url = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + e +'?geometries=geojson&steps=true&&access_token=' + mapboxgl.accessToken;
    console.log("eta url:"+url);
    $.getJSON(url, function(jsonResponse) {
        var distance = (jsonResponse.routes[0].distance*0.001*0.621371).toFixed(2); // convert to km
        var duration = (jsonResponse.routes[0].duration/60).toFixed(2); // convert to minutes
        updateFunction(distance, duration, labelId);
    });
}



function getMatch(e) {
    console.log("match route invoked");
    mapboxgl.accessToken = ACCESS_TOKEN
    var directionsRequest = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + e +'?geometries=geojson&steps=true&&access_token=' + mapboxgl.accessToken;

    $.ajax({
        method: 'GET',
        url: directionsRequest,
    }).done(function(data) {
        var geo = data.routes[0].geometry;
        var distancebtw = data.routes[0].distance*0.001;
        var durationbtw = data.routes[0].duration*60;

        console.log("distance is " + distancebtw);
        console.log("duration is " + durationbtw);

        if(geo!=null && geo.coordinates.length!=0){
            start = geo.coordinates[0];
            end = geo.coordinates[geo.coordinates.length-1];
            setTimeout(getMatch(e), 10000);

        }
    })
}

function abc(){
    console.log("hello hello");
}

function book(){
    $("#bookB").text("Booked");
    document.getElementById('bookB').style.display = 'block';
    document.getElementById('go_bak_btn').style.display = 'block';
    document.getElementById('go_bak_btn').style.visibility = 'hidden'
    // document.getElementById('bookB').disabled = true; 
    var getNearestVehicleUrl = 'http://tamuber-mock-server.herokuapp.com/api/vehicles/'+vehicleId+'/book';
    $.ajax({
        method: 'POST',
        url: getNearestVehicleUrl,
        error: function() {
            console.log('Unable to book vehicle...');
        }
    }).done(function(nearestVehicle) {
        booked = true;
    });
}
;
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
 * EventEmitter2
 * https://github.com/hij1nx/EventEmitter2
 *
 * Copyright (c) 2013 hij1nx
 * Licensed under the MIT license.
 */
;!function(undefined) {

  var isArray = Array.isArray ? Array.isArray : function _isArray(obj) {
    return Object.prototype.toString.call(obj) === "[object Array]";
  };
  var defaultMaxListeners = 10;

  function init() {
    this._events = {};
    if (this._conf) {
      configure.call(this, this._conf);
    }
  }

  function configure(conf) {
    if (conf) {
      this._conf = conf;

      conf.delimiter && (this.delimiter = conf.delimiter);
      this._events.maxListeners = conf.maxListeners !== undefined ? conf.maxListeners : defaultMaxListeners;
      conf.wildcard && (this.wildcard = conf.wildcard);
      conf.newListener && (this.newListener = conf.newListener);
      conf.verboseMemoryLeak && (this.verboseMemoryLeak = conf.verboseMemoryLeak);

      if (this.wildcard) {
        this.listenerTree = {};
      }
    } else {
      this._events.maxListeners = defaultMaxListeners;
    }
  }

  function logPossibleMemoryLeak(count, eventName) {
    var errorMsg = '(node) warning: possible EventEmitter memory ' +
        'leak detected. %d listeners added. ' +
        'Use emitter.setMaxListeners() to increase limit.';

    if(this.verboseMemoryLeak){
      errorMsg += ' Event name: %s.';
      console.error(errorMsg, count, eventName);
    } else {
      console.error(errorMsg, count);
    }

    if (console.trace){
      console.trace();
    }
  }

  function EventEmitter(conf) {
    this._events = {};
    this.newListener = false;
    this.verboseMemoryLeak = false;
    configure.call(this, conf);
  }
  EventEmitter.EventEmitter2 = EventEmitter; // backwards compatibility for exporting EventEmitter property

  //
  // Attention, function return type now is array, always !
  // It has zero elements if no any matches found and one or more
  // elements (leafs) if there are matches
  //
  function searchListenerTree(handlers, type, tree, i) {
    if (!tree) {
      return [];
    }
    var listeners=[], leaf, len, branch, xTree, xxTree, isolatedBranch, endReached,
        typeLength = type.length, currentType = type[i], nextType = type[i+1];
    if (i === typeLength && tree._listeners) {
      //
      // If at the end of the event(s) list and the tree has listeners
      // invoke those listeners.
      //
      if (typeof tree._listeners === 'function') {
        handlers && handlers.push(tree._listeners);
        return [tree];
      } else {
        for (leaf = 0, len = tree._listeners.length; leaf < len; leaf++) {
          handlers && handlers.push(tree._listeners[leaf]);
        }
        return [tree];
      }
    }

    if ((currentType === '*' || currentType === '**') || tree[currentType]) {
      //
      // If the event emitted is '*' at this part
      // or there is a concrete match at this patch
      //
      if (currentType === '*') {
        for (branch in tree) {
          if (branch !== '_listeners' && tree.hasOwnProperty(branch)) {
            listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i+1));
          }
        }
        return listeners;
      } else if(currentType === '**') {
        endReached = (i+1 === typeLength || (i+2 === typeLength && nextType === '*'));
        if(endReached && tree._listeners) {
          // The next element has a _listeners, add it to the handlers.
          listeners = listeners.concat(searchListenerTree(handlers, type, tree, typeLength));
        }

        for (branch in tree) {
          if (branch !== '_listeners' && tree.hasOwnProperty(branch)) {
            if(branch === '*' || branch === '**') {
              if(tree[branch]._listeners && !endReached) {
                listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], typeLength));
              }
              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i));
            } else if(branch === nextType) {
              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i+2));
            } else {
              // No match on this one, shift into the tree but not in the type array.
              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i));
            }
          }
        }
        return listeners;
      }

      listeners = listeners.concat(searchListenerTree(handlers, type, tree[currentType], i+1));
    }

    xTree = tree['*'];
    if (xTree) {
      //
      // If the listener tree will allow any match for this part,
      // then recursively explore all branches of the tree
      //
      searchListenerTree(handlers, type, xTree, i+1);
    }

    xxTree = tree['**'];
    if(xxTree) {
      if(i < typeLength) {
        if(xxTree._listeners) {
          // If we have a listener on a '**', it will catch all, so add its handler.
          searchListenerTree(handlers, type, xxTree, typeLength);
        }

        // Build arrays of matching next branches and others.
        for(branch in xxTree) {
          if(branch !== '_listeners' && xxTree.hasOwnProperty(branch)) {
            if(branch === nextType) {
              // We know the next element will match, so jump twice.
              searchListenerTree(handlers, type, xxTree[branch], i+2);
            } else if(branch === currentType) {
              // Current node matches, move into the tree.
              searchListenerTree(handlers, type, xxTree[branch], i+1);
            } else {
              isolatedBranch = {};
              isolatedBranch[branch] = xxTree[branch];
              searchListenerTree(handlers, type, { '**': isolatedBranch }, i+1);
            }
          }
        }
      } else if(xxTree._listeners) {
        // We have reached the end and still on a '**'
        searchListenerTree(handlers, type, xxTree, typeLength);
      } else if(xxTree['*'] && xxTree['*']._listeners) {
        searchListenerTree(handlers, type, xxTree['*'], typeLength);
      }
    }

    return listeners;
  }

  function growListenerTree(type, listener) {

    type = typeof type === 'string' ? type.split(this.delimiter) : type.slice();

    //
    // Looks for two consecutive '**', if so, don't add the event at all.
    //
    for(var i = 0, len = type.length; i+1 < len; i++) {
      if(type[i] === '**' && type[i+1] === '**') {
        return;
      }
    }

    var tree = this.listenerTree;
    var name = type.shift();

    while (name !== undefined) {

      if (!tree[name]) {
        tree[name] = {};
      }

      tree = tree[name];

      if (type.length === 0) {

        if (!tree._listeners) {
          tree._listeners = listener;
        }
        else {
          if (typeof tree._listeners === 'function') {
            tree._listeners = [tree._listeners];
          }

          tree._listeners.push(listener);

          if (
            !tree._listeners.warned &&
            this._events.maxListeners > 0 &&
            tree._listeners.length > this._events.maxListeners
          ) {
            tree._listeners.warned = true;
            logPossibleMemoryLeak.call(this, tree._listeners.length, name);
          }
        }
        return true;
      }
      name = type.shift();
    }
    return true;
  }

  // By default EventEmitters will print a warning if more than
  // 10 listeners are added to it. This is a useful default which
  // helps finding memory leaks.
  //
  // Obviously not all Emitters should be limited to 10. This function allows
  // that to be increased. Set to zero for unlimited.

  EventEmitter.prototype.delimiter = '.';

  EventEmitter.prototype.setMaxListeners = function(n) {
    if (n !== undefined) {
      this._events || init.call(this);
      this._events.maxListeners = n;
      if (!this._conf) this._conf = {};
      this._conf.maxListeners = n;
    }
  };

  EventEmitter.prototype.event = '';

  EventEmitter.prototype.once = function(event, fn) {
    this.many(event, 1, fn);
    return this;
  };

  EventEmitter.prototype.many = function(event, ttl, fn) {
    var self = this;

    if (typeof fn !== 'function') {
      throw new Error('many only accepts instances of Function');
    }

    function listener() {
      if (--ttl === 0) {
        self.off(event, listener);
      }
      fn.apply(this, arguments);
    }

    listener._origin = fn;

    this.on(event, listener);

    return self;
  };

  EventEmitter.prototype.emit = function() {

    this._events || init.call(this);

    var type = arguments[0];

    if (type === 'newListener' && !this.newListener) {
      if (!this._events.newListener) {
        return false;
      }
    }

    var al = arguments.length;
    var args,l,i,j;
    var handler;

    if (this._all && this._all.length) {
      handler = this._all.slice();
      if (al > 3) {
        args = new Array(al);
        for (j = 0; j < al; j++) args[j] = arguments[j];
      }

      for (i = 0, l = handler.length; i < l; i++) {
        this.event = type;
        switch (al) {
        case 1:
          handler[i].call(this, type);
          break;
        case 2:
          handler[i].call(this, type, arguments[1]);
          break;
        case 3:
          handler[i].call(this, type, arguments[1], arguments[2]);
          break;
        default:
          handler[i].apply(this, args);
        }
      }
    }

    if (this.wildcard) {
      handler = [];
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      searchListenerTree.call(this, handler, ns, this.listenerTree, 0);
    } else {
      handler = this._events[type];
      if (typeof handler === 'function') {
        this.event = type;
        switch (al) {
        case 1:
          handler.call(this);
          break;
        case 2:
          handler.call(this, arguments[1]);
          break;
        case 3:
          handler.call(this, arguments[1], arguments[2]);
          break;
        default:
          args = new Array(al - 1);
          for (j = 1; j < al; j++) args[j - 1] = arguments[j];
          handler.apply(this, args);
        }
        return true;
      } else if (handler) {
        // need to make copy of handlers because list can change in the middle
        // of emit call
        handler = handler.slice();
      }
    }

    if (handler && handler.length) {
      if (al > 3) {
        args = new Array(al - 1);
        for (j = 1; j < al; j++) args[j - 1] = arguments[j];
      }
      for (i = 0, l = handler.length; i < l; i++) {
        this.event = type;
        switch (al) {
        case 1:
          handler[i].call(this);
          break;
        case 2:
          handler[i].call(this, arguments[1]);
          break;
        case 3:
          handler[i].call(this, arguments[1], arguments[2]);
          break;
        default:
          handler[i].apply(this, args);
        }
      }
      return true;
    } else if (!this._all && type === 'error') {
      if (arguments[1] instanceof Error) {
        throw arguments[1]; // Unhandled 'error' event
      } else {
        throw new Error("Uncaught, unspecified 'error' event.");
      }
      return false;
    }

    return !!this._all;
  };

  EventEmitter.prototype.emitAsync = function() {

    this._events || init.call(this);

    var type = arguments[0];

    if (type === 'newListener' && !this.newListener) {
        if (!this._events.newListener) { return Promise.resolve([false]); }
    }

    var promises= [];

    var al = arguments.length;
    var args,l,i,j;
    var handler;

    if (this._all) {
      if (al > 3) {
        args = new Array(al);
        for (j = 1; j < al; j++) args[j] = arguments[j];
      }
      for (i = 0, l = this._all.length; i < l; i++) {
        this.event = type;
        switch (al) {
        case 1:
          promises.push(this._all[i].call(this, type));
          break;
        case 2:
          promises.push(this._all[i].call(this, type, arguments[1]));
          break;
        case 3:
          promises.push(this._all[i].call(this, type, arguments[1], arguments[2]));
          break;
        default:
          promises.push(this._all[i].apply(this, args));
        }
      }
    }

    if (this.wildcard) {
      handler = [];
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      searchListenerTree.call(this, handler, ns, this.listenerTree, 0);
    } else {
      handler = this._events[type];
    }

    if (typeof handler === 'function') {
      this.event = type;
      switch (al) {
      case 1:
        promises.push(handler.call(this));
        break;
      case 2:
        promises.push(handler.call(this, arguments[1]));
        break;
      case 3:
        promises.push(handler.call(this, arguments[1], arguments[2]));
        break;
      default:
        args = new Array(al - 1);
        for (j = 1; j < al; j++) args[j - 1] = arguments[j];
        promises.push(handler.apply(this, args));
      }
    } else if (handler && handler.length) {
      if (al > 3) {
        args = new Array(al - 1);
        for (j = 1; j < al; j++) args[j - 1] = arguments[j];
      }
      for (i = 0, l = handler.length; i < l; i++) {
        this.event = type;
        switch (al) {
        case 1:
          promises.push(handler[i].call(this));
          break;
        case 2:
          promises.push(handler[i].call(this, arguments[1]));
          break;
        case 3:
          promises.push(handler[i].call(this, arguments[1], arguments[2]));
          break;
        default:
          promises.push(handler[i].apply(this, args));
        }
      }
    } else if (!this._all && type === 'error') {
      if (arguments[1] instanceof Error) {
        return Promise.reject(arguments[1]); // Unhandled 'error' event
      } else {
        return Promise.reject("Uncaught, unspecified 'error' event.");
      }
    }

    return Promise.all(promises);
  };

  EventEmitter.prototype.on = function(type, listener) {
    if (typeof type === 'function') {
      this.onAny(type);
      return this;
    }

    if (typeof listener !== 'function') {
      throw new Error('on only accepts instances of Function');
    }
    this._events || init.call(this);

    // To avoid recursion in the case that type == "newListeners"! Before
    // adding it to the listeners, first emit "newListeners".
    this.emit('newListener', type, listener);

    if (this.wildcard) {
      growListenerTree.call(this, type, listener);
      return this;
    }

    if (!this._events[type]) {
      // Optimize the case of one listener. Don't need the extra array object.
      this._events[type] = listener;
    }
    else {
      if (typeof this._events[type] === 'function') {
        // Change to array.
        this._events[type] = [this._events[type]];
      }

      // If we've already got an array, just append.
      this._events[type].push(listener);

      // Check for listener leak
      if (
        !this._events[type].warned &&
        this._events.maxListeners > 0 &&
        this._events[type].length > this._events.maxListeners
      ) {
        this._events[type].warned = true;
        logPossibleMemoryLeak.call(this, this._events[type].length, type);
      }
    }

    return this;
  };

  EventEmitter.prototype.onAny = function(fn) {
    if (typeof fn !== 'function') {
      throw new Error('onAny only accepts instances of Function');
    }

    if (!this._all) {
      this._all = [];
    }

    // Add the function to the event listener collection.
    this._all.push(fn);
    return this;
  };

  EventEmitter.prototype.addListener = EventEmitter.prototype.on;

  EventEmitter.prototype.off = function(type, listener) {
    if (typeof listener !== 'function') {
      throw new Error('removeListener only takes instances of Function');
    }

    var handlers,leafs=[];

    if(this.wildcard) {
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);
    }
    else {
      // does not use listeners(), so no side effect of creating _events[type]
      if (!this._events[type]) return this;
      handlers = this._events[type];
      leafs.push({_listeners:handlers});
    }

    for (var iLeaf=0; iLeaf<leafs.length; iLeaf++) {
      var leaf = leafs[iLeaf];
      handlers = leaf._listeners;
      if (isArray(handlers)) {

        var position = -1;

        for (var i = 0, length = handlers.length; i < length; i++) {
          if (handlers[i] === listener ||
            (handlers[i].listener && handlers[i].listener === listener) ||
            (handlers[i]._origin && handlers[i]._origin === listener)) {
            position = i;
            break;
          }
        }

        if (position < 0) {
          continue;
        }

        if(this.wildcard) {
          leaf._listeners.splice(position, 1);
        }
        else {
          this._events[type].splice(position, 1);
        }

        if (handlers.length === 0) {
          if(this.wildcard) {
            delete leaf._listeners;
          }
          else {
            delete this._events[type];
          }
        }

        this.emit("removeListener", type, listener);

        return this;
      }
      else if (handlers === listener ||
        (handlers.listener && handlers.listener === listener) ||
        (handlers._origin && handlers._origin === listener)) {
        if(this.wildcard) {
          delete leaf._listeners;
        }
        else {
          delete this._events[type];
        }

        this.emit("removeListener", type, listener);
      }
    }

    function recursivelyGarbageCollect(root) {
      if (root === undefined) {
        return;
      }
      var keys = Object.keys(root);
      for (var i in keys) {
        var key = keys[i];
        var obj = root[key];
        if ((obj instanceof Function) || (typeof obj !== "object") || (obj === null))
          continue;
        if (Object.keys(obj).length > 0) {
          recursivelyGarbageCollect(root[key]);
        }
        if (Object.keys(obj).length === 0) {
          delete root[key];
        }
      }
    }
    recursivelyGarbageCollect(this.listenerTree);

    return this;
  };

  EventEmitter.prototype.offAny = function(fn) {
    var i = 0, l = 0, fns;
    if (fn && this._all && this._all.length > 0) {
      fns = this._all;
      for(i = 0, l = fns.length; i < l; i++) {
        if(fn === fns[i]) {
          fns.splice(i, 1);
          this.emit("removeListenerAny", fn);
          return this;
        }
      }
    } else {
      fns = this._all;
      for(i = 0, l = fns.length; i < l; i++)
        this.emit("removeListenerAny", fns[i]);
      this._all = [];
    }
    return this;
  };

  EventEmitter.prototype.removeListener = EventEmitter.prototype.off;

  EventEmitter.prototype.removeAllListeners = function(type) {
    if (arguments.length === 0) {
      !this._events || init.call(this);
      return this;
    }

    if (this.wildcard) {
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      var leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);

      for (var iLeaf=0; iLeaf<leafs.length; iLeaf++) {
        var leaf = leafs[iLeaf];
        leaf._listeners = null;
      }
    }
    else if (this._events) {
      this._events[type] = null;
    }
    return this;
  };

  EventEmitter.prototype.listeners = function(type) {
    if (this.wildcard) {
      var handlers = [];
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      searchListenerTree.call(this, handlers, ns, this.listenerTree, 0);
      return handlers;
    }

    this._events || init.call(this);

    if (!this._events[type]) this._events[type] = [];
    if (!isArray(this._events[type])) {
      this._events[type] = [this._events[type]];
    }
    return this._events[type];
  };

  EventEmitter.prototype.listenerCount = function(type) {
    return this.listeners(type).length;
  };

  EventEmitter.prototype.listenersAny = function() {

    if(this._all) {
      return this._all;
    }
    else {
      return [];
    }

  };

  if (typeof define === 'function' && define.amd) {
     // AMD. Register as an anonymous module.
    define(function() {
      return EventEmitter;
    });
  } else if (typeof exports === 'object') {
    // CommonJS
    module.exports = EventEmitter;
  }
  else {
    // Browser global.
    window.EventEmitter2 = EventEmitter;
  }
}();

},{}],2:[function(require,module,exports){
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],3:[function(require,module,exports){
/**
 * @fileOverview
 * @author Russell Toris - rctoris@wpi.edu
 */

/**
 * If you use roslib in a browser, all the classes will be exported to a global variable called ROSLIB.
 *
 * If you use nodejs, this is the variable you get when you require('roslib')
 */
var ROSLIB = this.ROSLIB || {
  REVISION : '0.20.0'
};

var assign = require('object-assign');

// Add core components
assign(ROSLIB, require('./core'));

assign(ROSLIB, require('./actionlib'));

assign(ROSLIB, require('./math'));

assign(ROSLIB, require('./tf'));

assign(ROSLIB, require('./urdf'));

module.exports = ROSLIB;

},{"./actionlib":9,"./core":18,"./math":23,"./tf":26,"./urdf":38,"object-assign":2}],4:[function(require,module,exports){
(function (global){
global.ROSLIB = require('./RosLib');
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./RosLib":3}],5:[function(require,module,exports){
/**
 * @fileOverview
 * @author Russell Toris - rctoris@wpi.edu
 */

var Topic = require('../core/Topic');
var Message = require('../core/Message');
var EventEmitter2 = require('eventemitter2').EventEmitter2;

/**
 * An actionlib action client.
 *
 * Emits the following events:
 *  * 'timeout' - if a timeout occurred while sending a goal
 *  * 'status' - the status messages received from the action server
 *  * 'feedback' -  the feedback messages received from the action server
 *  * 'result' - the result returned from the action server
 *
 *  @constructor
 *  @param options - object with following keys:
 *   * ros - the ROSLIB.Ros connection handle
 *   * serverName - the action server name, like /fibonacci
 *   * actionName - the action message name, like 'actionlib_tutorials/FibonacciAction'
 *   * timeout - the timeout length when connecting to the action server
 */
function ActionClient(options) {
  var that = this;
  options = options || {};
  this.ros = options.ros;
  this.serverName = options.serverName;
  this.actionName = options.actionName;
  this.timeout = options.timeout;
  this.omitFeedback = options.omitFeedback;
  this.omitStatus = options.omitStatus;
  this.omitResult = options.omitResult;
  this.goals = {};

  // flag to check if a status has been received
  var receivedStatus = false;

  // create the topics associated with actionlib
  this.feedbackListener = new Topic({
    ros : this.ros,
    name : this.serverName + '/feedback',
    messageType : this.actionName + 'Feedback'
  });

  this.statusListener = new Topic({
    ros : this.ros,
    name : this.serverName + '/status',
    messageType : 'actionlib_msgs/GoalStatusArray'
  });

  this.resultListener = new Topic({
    ros : this.ros,
    name : this.serverName + '/result',
    messageType : this.actionName + 'Result'
  });

  this.goalTopic = new Topic({
    ros : this.ros,
    name : this.serverName + '/goal',
    messageType : this.actionName + 'Goal'
  });

  this.cancelTopic = new Topic({
    ros : this.ros,
    name : this.serverName + '/cancel',
    messageType : 'actionlib_msgs/GoalID'
  });

  // advertise the goal and cancel topics
  this.goalTopic.advertise();
  this.cancelTopic.advertise();

  // subscribe to the status topic
  if (!this.omitStatus) {
    this.statusListener.subscribe(function(statusMessage) {
      receivedStatus = true;
      statusMessage.status_list.forEach(function(status) {
        var goal = that.goals[status.goal_id.id];
        if (goal) {
          goal.emit('status', status);
        }
      });
    });
  }

  // subscribe the the feedback topic
  if (!this.omitFeedback) {
    this.feedbackListener.subscribe(function(feedbackMessage) {
      var goal = that.goals[feedbackMessage.status.goal_id.id];
      if (goal) {
        goal.emit('status', feedbackMessage.status);
        goal.emit('feedback', feedbackMessage.feedback);
      }
    });
  }

  // subscribe to the result topic
  if (!this.omitResult) {
    this.resultListener.subscribe(function(resultMessage) {
      var goal = that.goals[resultMessage.status.goal_id.id];

      if (goal) {
        goal.emit('status', resultMessage.status);
        goal.emit('result', resultMessage.result);
      }
    });
  }

  // If timeout specified, emit a 'timeout' event if the action server does not respond
  if (this.timeout) {
    setTimeout(function() {
      if (!receivedStatus) {
        that.emit('timeout');
      }
    }, this.timeout);
  }
}

ActionClient.prototype.__proto__ = EventEmitter2.prototype;

/**
 * Cancel all goals associated with this ActionClient.
 */
ActionClient.prototype.cancel = function() {
  var cancelMessage = new Message();
  this.cancelTopic.publish(cancelMessage);
};

/**
 * Unsubscribe and unadvertise all topics associated with this ActionClient.
 */
ActionClient.prototype.dispose = function() {
  this.goalTopic.unadvertise();
  this.cancelTopic.unadvertise();
  if (!this.omitStatus) {this.statusListener.unsubscribe();}
  if (!this.omitFeedback) {this.feedbackListener.unsubscribe();}
  if (!this.omitResult) {this.resultListener.unsubscribe();}
};

module.exports = ActionClient;

},{"../core/Message":10,"../core/Topic":17,"eventemitter2":1}],6:[function(require,module,exports){
/**
 * @fileOverview
 * @author Justin Young - justin@oodar.com.au
 * @author Russell Toris - rctoris@wpi.edu
 */

var Topic = require('../core/Topic');
var Message = require('../core/Message');
var EventEmitter2 = require('eventemitter2').EventEmitter2;

/**
 * An actionlib action listener
 *
 * Emits the following events:
 *  * 'status' - the status messages received from the action server
 *  * 'feedback' -  the feedback messages received from the action server
 *  * 'result' - the result returned from the action server
 *
 *  @constructor
 *  @param options - object with following keys:
 *   * ros - the ROSLIB.Ros connection handle
 *   * serverName - the action server name, like /fibonacci
 *   * actionName - the action message name, like 'actionlib_tutorials/FibonacciAction'
 */
function ActionListener(options) {
  var that = this;
  options = options || {};
  this.ros = options.ros;
  this.serverName = options.serverName;
  this.actionName = options.actionName;
  this.timeout = options.timeout;
  this.omitFeedback = options.omitFeedback;
  this.omitStatus = options.omitStatus;
  this.omitResult = options.omitResult;


  // create the topics associated with actionlib
  var goalListener = new Topic({
    ros : this.ros,
    name : this.serverName + '/goal',
    messageType : this.actionName + 'Goal'
  });

  var feedbackListener = new Topic({
    ros : this.ros,
    name : this.serverName + '/feedback',
    messageType : this.actionName + 'Feedback'
  });

  var statusListener = new Topic({
    ros : this.ros,
    name : this.serverName + '/status',
    messageType : 'actionlib_msgs/GoalStatusArray'
  });

  var resultListener = new Topic({
    ros : this.ros,
    name : this.serverName + '/result',
    messageType : this.actionName + 'Result'
  });

  goalListener.subscribe(function(goalMessage) {
      that.emit('goal', goalMessage);
  });

  statusListener.subscribe(function(statusMessage) {
      statusMessage.status_list.forEach(function(status) {
          that.emit('status', status);
      });
  });

  feedbackListener.subscribe(function(feedbackMessage) {
      that.emit('status', feedbackMessage.status);
      that.emit('feedback', feedbackMessage.feedback);
  });

  // subscribe to the result topic
  resultListener.subscribe(function(resultMessage) {
      that.emit('status', resultMessage.status);
      that.emit('result', resultMessage.result);
  });

}

ActionListener.prototype.__proto__ = EventEmitter2.prototype;

module.exports = ActionListener;

},{"../core/Message":10,"../core/Topic":17,"eventemitter2":1}],7:[function(require,module,exports){
/**
 * @fileOverview
 * @author Russell Toris - rctoris@wpi.edu
 */

var Message = require('../core/Message');
var EventEmitter2 = require('eventemitter2').EventEmitter2;

/**
 * An actionlib goal goal is associated with an action server.
 *
 * Emits the following events:
 *  * 'timeout' - if a timeout occurred while sending a goal
 *
 *  @constructor
 *  @param object with following keys:
 *   * actionClient - the ROSLIB.ActionClient to use with this goal
 *   * goalMessage - The JSON object containing the goal for the action server
 */
function Goal(options) {
  var that = this;
  this.actionClient = options.actionClient;
  this.goalMessage = options.goalMessage;
  this.isFinished = false;

  // Used to create random IDs
  var date = new Date();

  // Create a random ID
  this.goalID = 'goal_' + Math.random() + '_' + date.getTime();
  // Fill in the goal message
  this.goalMessage = new Message({
    goal_id : {
      stamp : {
        secs : 0,
        nsecs : 0
      },
      id : this.goalID
    },
    goal : this.goalMessage
  });

  this.on('status', function(status) {
    that.status = status;
  });

  this.on('result', function(result) {
    that.isFinished = true;
    that.result = result;
  });

  this.on('feedback', function(feedback) {
    that.feedback = feedback;
  });

  // Add the goal
  this.actionClient.goals[this.goalID] = this;
}

Goal.prototype.__proto__ = EventEmitter2.prototype;

/**
 * Send the goal to the action server.
 *
 * @param timeout (optional) - a timeout length for the goal's result
 */
Goal.prototype.send = function(timeout) {
  var that = this;
  that.actionClient.goalTopic.publish(that.goalMessage);
  if (timeout) {
    setTimeout(function() {
      if (!that.isFinished) {
        that.emit('timeout');
      }
    }, timeout);
  }
};

/**
 * Cancel the current goal.
 */
Goal.prototype.cancel = function() {
  var cancelMessage = new Message({
    id : this.goalID
  });
  this.actionClient.cancelTopic.publish(cancelMessage);
};

module.exports = Goal;
},{"../core/Message":10,"eventemitter2":1}],8:[function(require,module,exports){
/**
 * @fileOverview
 * @author Laura Lindzey - lindzey@gmail.com
 */

var Topic = require('../core/Topic');
var Message = require('../core/Message');
var EventEmitter2 = require('eventemitter2').EventEmitter2;

/**
 * An actionlib action server client.
 *
 * Emits the following events:
 *  * 'goal' - goal sent by action client
 *  * 'cancel' - action client has canceled the request
 *
 *  @constructor
 *  @param options - object with following keys:
 *   * ros - the ROSLIB.Ros connection handle
 *   * serverName - the action server name, like /fibonacci
 *   * actionName - the action message name, like 'actionlib_tutorials/FibonacciAction'
 */

function SimpleActionServer(options) {
    var that = this;
    options = options || {};
    this.ros = options.ros;
    this.serverName = options.serverName;
    this.actionName = options.actionName;

    // create and advertise publishers
    this.feedbackPublisher = new Topic({
        ros : this.ros,
        name : this.serverName + '/feedback',
        messageType : this.actionName + 'Feedback'
    });
    this.feedbackPublisher.advertise();

    var statusPublisher = new Topic({
        ros : this.ros,
        name : this.serverName + '/status',
        messageType : 'actionlib_msgs/GoalStatusArray'
    });
    statusPublisher.advertise();

    this.resultPublisher = new Topic({
        ros : this.ros,
        name : this.serverName + '/result',
        messageType : this.actionName + 'Result'
    });
    this.resultPublisher.advertise();

    // create and subscribe to listeners
    var goalListener = new Topic({
        ros : this.ros,
        name : this.serverName + '/goal',
        messageType : this.actionName + 'Goal'
    });

    var cancelListener = new Topic({
        ros : this.ros,
        name : this.serverName + '/cancel',
        messageType : 'actionlib_msgs/GoalID'
    });

    // Track the goals and their status in order to publish status...
    this.statusMessage = new Message({
        header : {
            stamp : {secs : 0, nsecs : 100},
            frame_id : ''
        },
        status_list : []
    });

    // needed for handling preemption prompted by a new goal being received
    this.currentGoal = null; // currently tracked goal
    this.nextGoal = null; // the one that'll be preempting

    goalListener.subscribe(function(goalMessage) {
        
    if(that.currentGoal) {
            that.nextGoal = goalMessage;
            // needs to happen AFTER rest is set up
            that.emit('cancel');
    } else {
            that.statusMessage.status_list = [{goal_id : goalMessage.goal_id, status : 1}];
            that.currentGoal = goalMessage;
            that.emit('goal', goalMessage.goal);
    }
    });

    // helper function for determing ordering of timestamps
    // returns t1 < t2
    var isEarlier = function(t1, t2) {
        if(t1.secs > t2.secs) {
            return false;
        } else if(t1.secs < t2.secs) {
            return true;
        } else if(t1.nsecs < t2.nsecs) {
            return true;
        } else {
            return false;
        }
    };

    // TODO: this may be more complicated than necessary, since I'm
    // not sure if the callbacks can ever wind up with a scenario
    // where we've been preempted by a next goal, it hasn't finished
    // processing, and then we get a cancel message
    cancelListener.subscribe(function(cancelMessage) {

        // cancel ALL goals if both empty
        if(cancelMessage.stamp.secs === 0 && cancelMessage.stamp.secs === 0 && cancelMessage.id === '') {
            that.nextGoal = null;
            if(that.currentGoal) {
                that.emit('cancel');
            }
        } else { // treat id and stamp independently
            if(that.currentGoal && cancelMessage.id === that.currentGoal.goal_id.id) {
                that.emit('cancel');
            } else if(that.nextGoal && cancelMessage.id === that.nextGoal.goal_id.id) {
                that.nextGoal = null;
            }

            if(that.nextGoal && isEarlier(that.nextGoal.goal_id.stamp,
                                          cancelMessage.stamp)) {
                that.nextGoal = null;
            }
            if(that.currentGoal && isEarlier(that.currentGoal.goal_id.stamp,
                                             cancelMessage.stamp)) {
                
                that.emit('cancel');
            }
        }
    });

    // publish status at pseudo-fixed rate; required for clients to know they've connected
    var statusInterval = setInterval( function() {
        var currentTime = new Date();
        var secs = Math.floor(currentTime.getTime()/1000);
        var nsecs = Math.round(1000000000*(currentTime.getTime()/1000-secs));
        that.statusMessage.header.stamp.secs = secs;
        that.statusMessage.header.stamp.nsecs = nsecs;
        statusPublisher.publish(that.statusMessage);
    }, 500); // publish every 500ms

}

SimpleActionServer.prototype.__proto__ = EventEmitter2.prototype;

/**
*  Set action state to succeeded and return to client
*/

SimpleActionServer.prototype.setSucceeded = function(result2) {
    

    var resultMessage = new Message({
        status : {goal_id : this.currentGoal.goal_id, status : 3},
        result : result2
    });
    this.resultPublisher.publish(resultMessage);

    this.statusMessage.status_list = [];
    if(this.nextGoal) {
        this.currentGoal = this.nextGoal;
        this.nextGoal = null;
        this.emit('goal', this.currentGoal.goal);
    } else {
        this.currentGoal = null;
    }
};

/**
*  Function to send feedback
*/

SimpleActionServer.prototype.sendFeedback = function(feedback2) {

    var feedbackMessage = new Message({
        status : {goal_id : this.currentGoal.goal_id, status : 1},
        feedback : feedback2
    });
    this.feedbackPublisher.publish(feedbackMessage);
};

/**
*  Handle case where client requests preemption
*/

SimpleActionServer.prototype.setPreempted = function() {

    this.statusMessage.status_list = [];
    var resultMessage = new Message({
        status : {goal_id : this.currentGoal.goal_id, status : 2},
    });
    this.resultPublisher.publish(resultMessage);

    if(this.nextGoal) {
        this.currentGoal = this.nextGoal;
        this.nextGoal = null;
        this.emit('goal', this.currentGoal.goal);
    } else {
        this.currentGoal = null;
    }
};

module.exports = SimpleActionServer;
},{"../core/Message":10,"../core/Topic":17,"eventemitter2":1}],9:[function(require,module,exports){
var Ros = require('../core/Ros');
var mixin = require('../mixin');

var action = module.exports = {
    ActionClient: require('./ActionClient'),
    ActionListener: require('./ActionListener'),
    Goal: require('./Goal'),
    SimpleActionServer: require('./SimpleActionServer')
};

mixin(Ros, ['ActionClient', 'SimpleActionServer'], action);

},{"../core/Ros":12,"../mixin":24,"./ActionClient":5,"./ActionListener":6,"./Goal":7,"./SimpleActionServer":8}],10:[function(require,module,exports){
/**
 * @fileoverview
 * @author Brandon Alexander - baalexander@gmail.com
 */

var assign = require('object-assign');

/**
 * Message objects are used for publishing and subscribing to and from topics.
 *
 * @constructor
 * @param values - object matching the fields defined in the .msg definition file
 */
function Message(values) {
  assign(this, values);
}

module.exports = Message;
},{"object-assign":2}],11:[function(require,module,exports){
/**
 * @fileoverview
 * @author Brandon Alexander - baalexander@gmail.com
 */

var Service = require('./Service');
var ServiceRequest = require('./ServiceRequest');

/**
 * A ROS parameter.
 *
 * @constructor
 * @param options - possible keys include:
 *   * ros - the ROSLIB.Ros connection handle
 *   * name - the param name, like max_vel_x
 */
function Param(options) {
  options = options || {};
  this.ros = options.ros;
  this.name = options.name;
}

/**
 * Fetches the value of the param.
 *
 * @param callback - function with the following params:
 *  * value - the value of the param from ROS.
 */
Param.prototype.get = function(callback) {
  var paramClient = new Service({
    ros : this.ros,
    name : '/rosapi/get_param',
    serviceType : 'rosapi/GetParam'
  });

  var request = new ServiceRequest({
    name : this.name
  });

  paramClient.callService(request, function(result) {
    var value = JSON.parse(result.value);
    callback(value);
  });
};

/**
 * Sets the value of the param in ROS.
 *
 * @param value - value to set param to.
 */
Param.prototype.set = function(value, callback) {
  var paramClient = new Service({
    ros : this.ros,
    name : '/rosapi/set_param',
    serviceType : 'rosapi/SetParam'
  });

  var request = new ServiceRequest({
    name : this.name,
    value : JSON.stringify(value)
  });

  paramClient.callService(request, callback);
};

/**
 * Delete this parameter on the ROS server.
 */
Param.prototype.delete = function(callback) {
  var paramClient = new Service({
    ros : this.ros,
    name : '/rosapi/delete_param',
    serviceType : 'rosapi/DeleteParam'
  });

  var request = new ServiceRequest({
    name : this.name
  });

  paramClient.callService(request, callback);
};

module.exports = Param;
},{"./Service":13,"./ServiceRequest":14}],12:[function(require,module,exports){
/**
 * @fileoverview
 * @author Brandon Alexander - baalexander@gmail.com
 */

var WebSocket = require('ws');
var socketAdapter = require('./SocketAdapter.js');

var Service = require('./Service');
var ServiceRequest = require('./ServiceRequest');

var assign = require('object-assign');
var EventEmitter2 = require('eventemitter2').EventEmitter2;

/**
 * Manages connection to the server and all interactions with ROS.
 *
 * Emits the following events:
 *  * 'error' - there was an error with ROS
 *  * 'connection' - connected to the WebSocket server
 *  * 'close' - disconnected to the WebSocket server
 *  * <topicName> - a message came from rosbridge with the given topic name
 *  * <serviceID> - a service response came from rosbridge with the given ID
 *
 * @constructor
 * @param options - possible keys include: <br>
 *   * url (optional) - (can be specified later with `connect`) the WebSocket URL for rosbridge or the node server url to connect using socket.io (if socket.io exists in the page) <br>
 *   * groovyCompatibility - don't use interfaces that changed after the last groovy release or rosbridge_suite and related tools (defaults to true)
 *   * transportLibrary (optional) - one of 'websocket' (default), 'socket.io' or RTCPeerConnection instance controlling how the connection is created in `connect`.
 *   * transportOptions (optional) - the options to use use when creating a connection. Currently only used if `transportLibrary` is RTCPeerConnection.
 */
function Ros(options) {
  options = options || {};
  this.socket = null;
  this.idCounter = 0;
  this.isConnected = false;
  this.transportLibrary = options.transportLibrary || 'websocket';
  this.transportOptions = options.transportOptions || {};

  if (typeof options.groovyCompatibility === 'undefined') {
    this.groovyCompatibility = true;
  }
  else {
    this.groovyCompatibility = options.groovyCompatibility;
  }

  // Sets unlimited event listeners.
  this.setMaxListeners(0);

  // begin by checking if a URL was given
  if (options.url) {
    this.connect(options.url);
  }
}

Ros.prototype.__proto__ = EventEmitter2.prototype;

/**
 * Connect to the specified WebSocket.
 *
 * @param url - WebSocket URL or RTCDataChannel label for Rosbridge
 */
Ros.prototype.connect = function(url) {
  if (this.transportLibrary === 'socket.io') {
    this.socket = assign(io(url, {'force new connection': true}), socketAdapter(this));
    this.socket.on('connect', this.socket.onopen);
    this.socket.on('data', this.socket.onmessage);
    this.socket.on('close', this.socket.onclose);
    this.socket.on('error', this.socket.onerror);
  } else if (this.transportLibrary.constructor.name === 'RTCPeerConnection') {
    this.socket = assign(this.transportLibrary.createDataChannel(url, this.transportOptions), socketAdapter(this));
  }else {
    this.socket = assign(new WebSocket(url), socketAdapter(this));
  }

};

/**
 * Disconnect from the WebSocket server.
 */
Ros.prototype.close = function() {
  if (this.socket) {
    this.socket.close();
  }
};

/**
 * Sends an authorization request to the server.
 *
 * @param mac - MAC (hash) string given by the trusted source.
 * @param client - IP of the client.
 * @param dest - IP of the destination.
 * @param rand - Random string given by the trusted source.
 * @param t - Time of the authorization request.
 * @param level - User level as a string given by the client.
 * @param end - End time of the client's session.
 */
Ros.prototype.authenticate = function(mac, client, dest, rand, t, level, end) {
  // create the request
  var auth = {
    op : 'auth',
    mac : mac,
    client : client,
    dest : dest,
    rand : rand,
    t : t,
    level : level,
    end : end
  };
  // send the request
  this.callOnConnection(auth);
};

/**
 * Sends the message over the WebSocket, but queues the message up if not yet
 * connected.
 */
Ros.prototype.callOnConnection = function(message) {
  var that = this;
  var messageJson = JSON.stringify(message);
  var emitter = null;
  if (this.transportLibrary === 'socket.io') {
    emitter = function(msg){that.socket.emit('operation', msg);};
  } else {
    emitter = function(msg){that.socket.send(msg);};
  }

  if (!this.isConnected) {
    that.once('connection', function() {
      emitter(messageJson);
    });
  } else {
    emitter(messageJson);
  }
};

/**
 * Sends a set_level request to the server
 *
 * @param level - Status level (none, error, warning, info)
 * @param id - Optional: Operation ID to change status level on
 */
Ros.prototype.setStatusLevel = function(level, id){
  var levelMsg = {
    op: 'set_level',
    level: level,
    id: id
  };

  this.callOnConnection(levelMsg);
};

/**
 * Retrieves Action Servers in ROS as an array of string
 *
 *   * actionservers - Array of action server names
 */
Ros.prototype.getActionServers = function(callback, failedCallback) {
  var getActionServers = new Service({
    ros : this,
    name : '/rosapi/action_servers',
    serviceType : 'rosapi/GetActionServers'
  });

  var request = new ServiceRequest({});
  if (typeof failedCallback === 'function'){
    getActionServers.callService(request,
      function(result) {
        callback(result.action_servers);
      },
      function(message){
        failedCallback(message);
      }
    );
  }else{
    getActionServers.callService(request, function(result) {
      callback(result.action_servers);
    });
  }
};

/**
 * Retrieves list of topics in ROS as an array.
 *
 * @param callback function with params:
 *   * topics - Array of topic names
 */
Ros.prototype.getTopics = function(callback, failedCallback) {
  var topicsClient = new Service({
    ros : this,
    name : '/rosapi/topics',
    serviceType : 'rosapi/Topics'
  });

  var request = new ServiceRequest();
  if (typeof failedCallback === 'function'){
    topicsClient.callService(request,
      function(result) {
        callback(result);
      },
      function(message){
        failedCallback(message);
      }
    );
  }else{
    topicsClient.callService(request, function(result) {
      callback(result);
    });
  }
};

/**
 * Retrieves Topics in ROS as an array as specific type
 *
 * @param topicType topic type to find:
 * @param callback function with params:
 *   * topics - Array of topic names
 */
Ros.prototype.getTopicsForType = function(topicType, callback, failedCallback) {
  var topicsForTypeClient = new Service({
    ros : this,
    name : '/rosapi/topics_for_type',
    serviceType : 'rosapi/TopicsForType'
  });

  var request = new ServiceRequest({
    type: topicType
  });
  if (typeof failedCallback === 'function'){
    topicsForTypeClient.callService(request,
      function(result) {
        callback(result.topics);
      },
      function(message){
        failedCallback(message);
      }
    );
  }else{
    topicsForTypeClient.callService(request, function(result) {
      callback(result.topics);
    });
  }
};

/**
 * Retrieves list of active service names in ROS.
 *
 * @param callback - function with the following params:
 *   * services - array of service names
 */
Ros.prototype.getServices = function(callback, failedCallback) {
  var servicesClient = new Service({
    ros : this,
    name : '/rosapi/services',
    serviceType : 'rosapi/Services'
  });

  var request = new ServiceRequest();
  if (typeof failedCallback === 'function'){
    servicesClient.callService(request,
      function(result) {
        callback(result.services);
      },
      function(message) {
        failedCallback(message);
      }
    );
  }else{
    servicesClient.callService(request, function(result) {
      callback(result.services);
    });
  }
};

/**
 * Retrieves list of services in ROS as an array as specific type
 *
 * @param serviceType service type to find:
 * @param callback function with params:
 *   * topics - Array of service names
 */
Ros.prototype.getServicesForType = function(serviceType, callback, failedCallback) {
  var servicesForTypeClient = new Service({
    ros : this,
    name : '/rosapi/services_for_type',
    serviceType : 'rosapi/ServicesForType'
  });

  var request = new ServiceRequest({
    type: serviceType
  });
  if (typeof failedCallback === 'function'){
    servicesForTypeClient.callService(request,
      function(result) {
        callback(result.services);
      },
      function(message) {
        failedCallback(message);
      }
    );
  }else{
    servicesForTypeClient.callService(request, function(result) {
      callback(result.services);
    });
  }
};

/**
 * Retrieves a detail of ROS service request.
 *
 * @param service name of service:
 * @param callback - function with params:
 *   * type - String of the service type
 */
Ros.prototype.getServiceRequestDetails = function(type, callback, failedCallback) {
  var serviceTypeClient = new Service({
    ros : this,
    name : '/rosapi/service_request_details',
    serviceType : 'rosapi/ServiceRequestDetails'
  });
  var request = new ServiceRequest({
    type: type
  });

  if (typeof failedCallback === 'function'){
    serviceTypeClient.callService(request,
      function(result) {
        callback(result);
      },
      function(message){
        failedCallback(message);
      }
    );
  }else{
    serviceTypeClient.callService(request, function(result) {
      callback(result);
    });
  }
};

/**
 * Retrieves a detail of ROS service request.
 *
 * @param service name of service:
 * @param callback - function with params:
 *   * type - String of the service type
 */
Ros.prototype.getServiceResponseDetails = function(type, callback, failedCallback) {
  var serviceTypeClient = new Service({
    ros : this,
    name : '/rosapi/service_response_details',
    serviceType : 'rosapi/ServiceResponseDetails'
  });
  var request = new ServiceRequest({
    type: type
  });

  if (typeof failedCallback === 'function'){
    serviceTypeClient.callService(request,
      function(result) {
        callback(result);
      },
      function(message){
        failedCallback(message);
      }
    );
  }else{
    serviceTypeClient.callService(request, function(result) {
      callback(result);
    });
  }
};

/**
 * Retrieves list of active node names in ROS.
 *
 * @param callback - function with the following params:
 *   * nodes - array of node names
 */
Ros.prototype.getNodes = function(callback, failedCallback) {
  var nodesClient = new Service({
    ros : this,
    name : '/rosapi/nodes',
    serviceType : 'rosapi/Nodes'
  });

  var request = new ServiceRequest();
  if (typeof failedCallback === 'function'){
    nodesClient.callService(request,
      function(result) {
        callback(result.nodes);
      },
      function(message) {
        failedCallback(message);
      }
    );
  }else{
    nodesClient.callService(request, function(result) {
      callback(result.nodes);
    });
  }
};

/**
  * Retrieves list subscribed topics, publishing topics and services of a specific node
  *
  * @param node name of the node:
  * @param callback - function with params:
  *   * publications - array of published topic names
  *   * subscriptions - array of subscribed topic names
  *   * services - array of service names hosted
  */
Ros.prototype.getNodeDetails = function(node, callback, failedCallback) {
  var nodesClient = new Service({
    ros : this,
    name : '/rosapi/node_details',
    serviceType : 'rosapi/NodeDetails'
  });

  var request = new ServiceRequest({
    node: node
  });
  if (typeof failedCallback === 'function'){
    nodesClient.callService(request,
      function(result) {
        callback(result.subscribing, result.publishing, result.services);
      },
      function(message) {
        failedCallback(message);
      }
    );
  } else {
    nodesClient.callService(request, function(result) {
      callback(result);
    });
  }
};

/**
 * Retrieves list of param names from the ROS Parameter Server.
 *
 * @param callback function with params:
 *  * params - array of param names.
 */
Ros.prototype.getParams = function(callback, failedCallback) {
  var paramsClient = new Service({
    ros : this,
    name : '/rosapi/get_param_names',
    serviceType : 'rosapi/GetParamNames'
  });
  var request = new ServiceRequest();
  if (typeof failedCallback === 'function'){
    paramsClient.callService(request,
      function(result) {
        callback(result.names);
      },
      function(message){
        failedCallback(message);
      }
    );
  }else{
    paramsClient.callService(request, function(result) {
      callback(result.names);
    });
  }
};

/**
 * Retrieves a type of ROS topic.
 *
 * @param topic name of the topic:
 * @param callback - function with params:
 *   * type - String of the topic type
 */
Ros.prototype.getTopicType = function(topic, callback, failedCallback) {
  var topicTypeClient = new Service({
    ros : this,
    name : '/rosapi/topic_type',
    serviceType : 'rosapi/TopicType'
  });
  var request = new ServiceRequest({
    topic: topic
  });

  if (typeof failedCallback === 'function'){
    topicTypeClient.callService(request,
      function(result) {
        callback(result.type);
      },
      function(message){
        failedCallback(message);
      }
    );
  }else{
    topicTypeClient.callService(request, function(result) {
      callback(result.type);
    });
  }
};

/**
 * Retrieves a type of ROS service.
 *
 * @param service name of service:
 * @param callback - function with params:
 *   * type - String of the service type
 */
Ros.prototype.getServiceType = function(service, callback, failedCallback) {
  var serviceTypeClient = new Service({
    ros : this,
    name : '/rosapi/service_type',
    serviceType : 'rosapi/ServiceType'
  });
  var request = new ServiceRequest({
    service: service
  });

  if (typeof failedCallback === 'function'){
    serviceTypeClient.callService(request,
      function(result) {
        callback(result.type);
      },
      function(message){
        failedCallback(message);
      }
    );
  }else{
    serviceTypeClient.callService(request, function(result) {
      callback(result.type);
    });
  }
};

/**
 * Retrieves a detail of ROS message.
 *
 * @param callback - function with params:
 *   * details - Array of the message detail
 * @param message - String of a topic type
 */
Ros.prototype.getMessageDetails = function(message, callback, failedCallback) {
  var messageDetailClient = new Service({
    ros : this,
    name : '/rosapi/message_details',
    serviceType : 'rosapi/MessageDetails'
  });
  var request = new ServiceRequest({
    type: message
  });

  if (typeof failedCallback === 'function'){
    messageDetailClient.callService(request,
      function(result) {
        callback(result.typedefs);
      },
      function(message){
        failedCallback(message);
      }
    );
  }else{
    messageDetailClient.callService(request, function(result) {
      callback(result.typedefs);
    });
  }
};

/**
 * Decode a typedefs into a dictionary like `rosmsg show foo/bar`
 *
 * @param defs - array of type_def dictionary
 */
Ros.prototype.decodeTypeDefs = function(defs) {
  var that = this;

  // calls itself recursively to resolve type definition using hints.
  var decodeTypeDefsRec = function(theType, hints) {
    var typeDefDict = {};
    for (var i = 0; i < theType.fieldnames.length; i++) {
      var arrayLen = theType.fieldarraylen[i];
      var fieldName = theType.fieldnames[i];
      var fieldType = theType.fieldtypes[i];
      if (fieldType.indexOf('/') === -1) { // check the fieldType includes '/' or not
        if (arrayLen === -1) {
          typeDefDict[fieldName] = fieldType;
        }
        else {
          typeDefDict[fieldName] = [fieldType];
        }
      }
      else {
        // lookup the name
        var sub = false;
        for (var j = 0; j < hints.length; j++) {
          if (hints[j].type.toString() === fieldType.toString()) {
            sub = hints[j];
            break;
          }
        }
        if (sub) {
          var subResult = decodeTypeDefsRec(sub, hints);
          if (arrayLen === -1) {
          }
          else {
            typeDefDict[fieldName] = [subResult];
          }
        }
        else {
          that.emit('error', 'Cannot find ' + fieldType + ' in decodeTypeDefs');
        }
      }
    }
    return typeDefDict;
  };

  return decodeTypeDefsRec(defs[0], defs);
};


module.exports = Ros;

},{"./Service":13,"./ServiceRequest":14,"./SocketAdapter.js":16,"eventemitter2":1,"object-assign":2,"ws":39}],13:[function(require,module,exports){
/**
 * @fileoverview
 * @author Brandon Alexander - baalexander@gmail.com
 */

var ServiceResponse = require('./ServiceResponse');
var ServiceRequest = require('./ServiceRequest');
var EventEmitter2 = require('eventemitter2').EventEmitter2;

/**
 * A ROS service client.
 *
 * @constructor
 * @params options - possible keys include:
 *   * ros - the ROSLIB.Ros connection handle
 *   * name - the service name, like /add_two_ints
 *   * serviceType - the service type, like 'rospy_tutorials/AddTwoInts'
 */
function Service(options) {
  options = options || {};
  this.ros = options.ros;
  this.name = options.name;
  this.serviceType = options.serviceType;
  this.isAdvertised = false;

  this._serviceCallback = null;
}
Service.prototype.__proto__ = EventEmitter2.prototype;
/**
 * Calls the service. Returns the service response in the callback.
 *
 * @param request - the ROSLIB.ServiceRequest to send
 * @param callback - function with params:
 *   * response - the response from the service request
 * @param failedCallback - the callback function when the service call failed (optional). Params:
 *   * error - the error message reported by ROS
 */
Service.prototype.callService = function(request, callback, failedCallback) {
  if (this.isAdvertised) {
    return;
  }

  var serviceCallId = 'call_service:' + this.name + ':' + (++this.ros.idCounter);

  if (callback || failedCallback) {
    this.ros.once(serviceCallId, function(message) {
      if (message.result !== undefined && message.result === false) {
        if (typeof failedCallback === 'function') {
          failedCallback(message.values);
        }
      } else if (typeof callback === 'function') {
        callback(new ServiceResponse(message.values));
      }
    });
  }

  var call = {
    op : 'call_service',
    id : serviceCallId,
    service : this.name,
    args : request
  };
  this.ros.callOnConnection(call);
};

/**
 * Every time a message is published for the given topic, the callback
 * will be called with the message object.
 *
 * @param callback - function with the following params:
 *   * message - the published message
 */
Service.prototype.advertise = function(callback) {
  if (this.isAdvertised || typeof callback !== 'function') {
    return;
  }

  this._serviceCallback = callback;
  this.ros.on(this.name, this._serviceResponse.bind(this));
  this.ros.callOnConnection({
    op: 'advertise_service',
    type: this.serviceType,
    service: this.name
  });
  this.isAdvertised = true;
};

Service.prototype.unadvertise = function() {
  if (!this.isAdvertised) {
    return;
  }
  this.ros.callOnConnection({
    op: 'unadvertise_service',
    service: this.name
  });
  this.isAdvertised = false;
};

Service.prototype._serviceResponse = function(rosbridgeRequest) {
  var response = {};
  var success = this._serviceCallback(rosbridgeRequest.args, response);

  var call = {
    op: 'service_response',
    service: this.name,
    values: new ServiceResponse(response),
    result: success
  };

  if (rosbridgeRequest.id) {
    call.id = rosbridgeRequest.id;
  }

  this.ros.callOnConnection(call);
};

module.exports = Service;
},{"./ServiceRequest":14,"./ServiceResponse":15,"eventemitter2":1}],14:[function(require,module,exports){
/**
 * @fileoverview
 * @author Brandon Alexander - balexander@willowgarage.com
 */

var assign = require('object-assign');

/**
 * A ServiceRequest is passed into the service call.
 *
 * @constructor
 * @param values - object matching the fields defined in the .srv definition file
 */
function ServiceRequest(values) {
  assign(this, values);
}

module.exports = ServiceRequest;
},{"object-assign":2}],15:[function(require,module,exports){
/**
 * @fileoverview
 * @author Brandon Alexander - balexander@willowgarage.com
 */

var assign = require('object-assign');

/**
 * A ServiceResponse is returned from the service call.
 *
 * @constructor
 * @param values - object matching the fields defined in the .srv definition file
 */
function ServiceResponse(values) {
  assign(this, values);
}

module.exports = ServiceResponse;
},{"object-assign":2}],16:[function(require,module,exports){
/**
 * Socket event handling utilities for handling events on either
 * WebSocket and TCP sockets
 *
 * Note to anyone reviewing this code: these functions are called
 * in the context of their parent object, unless bound
 * @fileOverview
 */
'use strict';

var decompressPng = require('../util/decompressPng');
var WebSocket = require('ws');
var BSON = null;
if(typeof bson !== 'undefined'){
    BSON = bson().BSON;
}

/**
 * Events listeners for a WebSocket or TCP socket to a JavaScript
 * ROS Client. Sets up Messages for a given topic to trigger an
 * event on the ROS client.
 *
 * @namespace SocketAdapter
 * @private
 */
function SocketAdapter(client) {
  function handleMessage(message) {
    if (message.op === 'publish') {
      client.emit(message.topic, message.msg);
    } else if (message.op === 'service_response') {
      client.emit(message.id, message);
    } else if (message.op === 'call_service') {
      client.emit(message.service, message);
    } else if(message.op === 'status'){
      if(message.id){
        client.emit('status:'+message.id, message);
      } else {
        client.emit('status', message);
      }
    }
  }

  function handlePng(message, callback) {
    if (message.op === 'png') {
      decompressPng(message.data, callback);
    } else {
      callback(message);
    }
  }

  function decodeBSON(data, callback) {
    if (!BSON) {
      throw 'Cannot process BSON encoded message without BSON header.';
    }
    var reader = new FileReader();
    reader.onload  = function() {
      var uint8Array = new Uint8Array(this.result);
      var msg = BSON.deserialize(uint8Array);
      callback(msg);
    };
    reader.readAsArrayBuffer(data);
  }

  return {
    /**
     * Emits a 'connection' event on WebSocket connection.
     *
     * @param event - the argument to emit with the event.
     * @memberof SocketAdapter
     */
    onopen: function onOpen(event) {
      client.isConnected = true;
      client.emit('connection', event);
    },

    /**
     * Emits a 'close' event on WebSocket disconnection.
     *
     * @param event - the argument to emit with the event.
     * @memberof SocketAdapter
     */
    onclose: function onClose(event) {
      client.isConnected = false;
      client.emit('close', event);
    },

    /**
     * Emits an 'error' event whenever there was an error.
     *
     * @param event - the argument to emit with the event.
     * @memberof SocketAdapter
     */
    onerror: function onError(event) {
      client.emit('error', event);
    },

    /**
     * Parses message responses from rosbridge and sends to the appropriate
     * topic, service, or param.
     *
     * @param message - the raw JSON message from rosbridge.
     * @memberof SocketAdapter
     */
    onmessage: function onMessage(data) {
      if (typeof Blob !== 'undefined' && data.data instanceof Blob) {
        decodeBSON(data.data, function (message) {
          handlePng(message, handleMessage);
        });
      } else {
        var message = JSON.parse(typeof data === 'string' ? data : data.data);
        handlePng(message, handleMessage);
      }
    }
  };
}

module.exports = SocketAdapter;

},{"../util/decompressPng":41,"ws":39}],17:[function(require,module,exports){
/**
 * @fileoverview
 * @author Brandon Alexander - baalexander@gmail.com
 */

var EventEmitter2 = require('eventemitter2').EventEmitter2;
var Message = require('./Message');

/**
 * Publish and/or subscribe to a topic in ROS.
 *
 * Emits the following events:
 *  * 'warning' - if there are any warning during the Topic creation
 *  * 'message' - the message data from rosbridge
 *
 * @constructor
 * @param options - object with following keys:
 *   * ros - the ROSLIB.Ros connection handle
 *   * name - the topic name, like /cmd_vel
 *   * messageType - the message type, like 'std_msgs/String'
 *   * compression - the type of compression to use, like 'png'
 *   * throttle_rate - the rate (in ms in between messages) at which to throttle the topics
 *   * queue_size - the queue created at bridge side for re-publishing webtopics (defaults to 100)
 *   * latch - latch the topic when publishing
 *   * queue_length - the queue length at bridge side used when subscribing (defaults to 0, no queueing).
 *   * reconnect_on_close - the flag to enable resubscription and readvertisement on close event(defaults to true).
 */
function Topic(options) {
  options = options || {};
  this.ros = options.ros;
  this.name = options.name;
  this.messageType = options.messageType;
  this.isAdvertised = false;
  this.compression = options.compression || 'none';
  this.throttle_rate = options.throttle_rate || 0;
  this.latch = options.latch || false;
  this.queue_size = options.queue_size || 100;
  this.queue_length = options.queue_length || 0;
  this.reconnect_on_close = options.reconnect_on_close || true;

  // Check for valid compression types
  if (this.compression && this.compression !== 'png' &&
    this.compression !== 'none') {
    this.emit('warning', this.compression +
      ' compression is not supported. No compression will be used.');
  }

  // Check if throttle rate is negative
  if (this.throttle_rate < 0) {
    this.emit('warning', this.throttle_rate + ' is not allowed. Set to 0');
    this.throttle_rate = 0;
  }

  var that = this;
  if (this.reconnect_on_close) {
    this.callForSubscribeAndAdvertise = function(message) {
      that.ros.callOnConnection(message);

      that.waitForReconnect = false;
      that.reconnectFunc = function() {
        if(!that.waitForReconnect) {
          that.waitForReconnect = true;
          that.ros.callOnConnection(message);
          that.ros.once('connection', function() {
            that.waitForReconnect = false;
          });
        }
      };
      that.ros.on('close', that.reconnectFunc);
    };
  }
  else {
    this.callForSubscribeAndAdvertise = this.ros.callOnConnection;
  }

  this._messageCallback = function(data) {
    that.emit('message', new Message(data));
  };
}
Topic.prototype.__proto__ = EventEmitter2.prototype;

/**
 * Every time a message is published for the given topic, the callback
 * will be called with the message object.
 *
 * @param callback - function with the following params:
 *   * message - the published message
 */
Topic.prototype.subscribe = function(callback) {
  if (typeof callback === 'function') {
    this.on('message', callback);
  }

  if (this.subscribeId) { return; }
  this.ros.on(this.name, this._messageCallback);
  this.subscribeId = 'subscribe:' + this.name + ':' + (++this.ros.idCounter);

  this.callForSubscribeAndAdvertise({
    op: 'subscribe',
    id: this.subscribeId,
    type: this.messageType,
    topic: this.name,
    compression: this.compression,
    throttle_rate: this.throttle_rate,
    queue_length: this.queue_length
  });
};

/**
 * Unregisters as a subscriber for the topic. Unsubscribing stop remove
 * all subscribe callbacks. To remove a call back, you must explicitly
 * pass the callback function in.
 *
 * @param callback - the optional callback to unregister, if
 *     * provided and other listeners are registered the topic won't
 *     * unsubscribe, just stop emitting to the passed listener
 */
Topic.prototype.unsubscribe = function(callback) {
  if (callback) {
    this.off('message', callback);
    // If there is any other callbacks still subscribed don't unsubscribe
    if (this.listeners('message').length) { return; }
  }
  if (!this.subscribeId) { return; }
  // Note: Don't call this.removeAllListeners, allow client to handle that themselves
  this.ros.off(this.name, this._messageCallback);
  if(this.reconnect_on_close) {
    this.ros.off('close', this.reconnectFunc);
  }
  this.emit('unsubscribe');
  this.ros.callOnConnection({
    op: 'unsubscribe',
    id: this.subscribeId,
    topic: this.name
  });
  this.subscribeId = null;
};


/**
 * Registers as a publisher for the topic.
 */
Topic.prototype.advertise = function() {
  if (this.isAdvertised) {
    return;
  }
  this.advertiseId = 'advertise:' + this.name + ':' + (++this.ros.idCounter);
  this.callForSubscribeAndAdvertise({
    op: 'advertise',
    id: this.advertiseId,
    type: this.messageType,
    topic: this.name,
    latch: this.latch,
    queue_size: this.queue_size
  });
  this.isAdvertised = true;

  if(!this.reconnect_on_close) {
    var that = this;
    this.ros.on('close', function() {
      that.isAdvertised = false;
    });
  }
};

/**
 * Unregisters as a publisher for the topic.
 */
Topic.prototype.unadvertise = function() {
  if (!this.isAdvertised) {
    return;
  }
  if(this.reconnect_on_close) {
    this.ros.off('close', this.reconnectFunc);
  }
  this.emit('unadvertise');
  this.ros.callOnConnection({
    op: 'unadvertise',
    id: this.advertiseId,
    topic: this.name
  });
  this.isAdvertised = false;
};

/**
 * Publish the message.
 *
 * @param message - A ROSLIB.Message object.
 */
Topic.prototype.publish = function(message) {
  if (!this.isAdvertised) {
    this.advertise();
  }

  this.ros.idCounter++;
  var call = {
    op: 'publish',
    id: 'publish:' + this.name + ':' + this.ros.idCounter,
    topic: this.name,
    msg: message,
    latch: this.latch
  };
  this.ros.callOnConnection(call);
};

module.exports = Topic;

},{"./Message":10,"eventemitter2":1}],18:[function(require,module,exports){
var mixin = require('../mixin');

var core = module.exports = {
    Ros: require('./Ros'),
    Topic: require('./Topic'),
    Message: require('./Message'),
    Param: require('./Param'),
    Service: require('./Service'),
    ServiceRequest: require('./ServiceRequest'),
    ServiceResponse: require('./ServiceResponse')
};

mixin(core.Ros, ['Param', 'Service', 'Topic'], core);

},{"../mixin":24,"./Message":10,"./Param":11,"./Ros":12,"./Service":13,"./ServiceRequest":14,"./ServiceResponse":15,"./Topic":17}],19:[function(require,module,exports){
/**
 * @fileoverview
 * @author David Gossow - dgossow@willowgarage.com
 */

var Vector3 = require('./Vector3');
var Quaternion = require('./Quaternion');

/**
 * A Pose in 3D space. Values are copied into this object.
 *
 *  @constructor
 *  @param options - object with following keys:
 *   * position - the Vector3 describing the position
 *   * orientation - the ROSLIB.Quaternion describing the orientation
 */
function Pose(options) {
  options = options || {};
  // copy the values into this object if they exist
  this.position = new Vector3(options.position);
  this.orientation = new Quaternion(options.orientation);
}

/**
 * Apply a transform against this pose.
 *
 * @param tf the transform
 */
Pose.prototype.applyTransform = function(tf) {
  this.position.multiplyQuaternion(tf.rotation);
  this.position.add(tf.translation);
  var tmp = tf.rotation.clone();
  tmp.multiply(this.orientation);
  this.orientation = tmp;
};

/**
 * Clone a copy of this pose.
 *
 * @returns the cloned pose
 */
Pose.prototype.clone = function() {
  return new Pose(this);
};

module.exports = Pose;
},{"./Quaternion":20,"./Vector3":22}],20:[function(require,module,exports){
/**
 * @fileoverview
 * @author David Gossow - dgossow@willowgarage.com
 */

/**
 * A Quaternion.
 *
 *  @constructor
 *  @param options - object with following keys:
 *   * x - the x value
 *   * y - the y value
 *   * z - the z value
 *   * w - the w value
 */
function Quaternion(options) {
  options = options || {};
  this.x = options.x || 0;
  this.y = options.y || 0;
  this.z = options.z || 0;
  this.w = (typeof options.w === 'number') ? options.w : 1;
}

/**
 * Perform a conjugation on this quaternion.
 */
Quaternion.prototype.conjugate = function() {
  this.x *= -1;
  this.y *= -1;
  this.z *= -1;
};

/**
 * Return the norm of this quaternion.
 */
Quaternion.prototype.norm = function() {
  return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
};

/**
 * Perform a normalization on this quaternion.
 */
Quaternion.prototype.normalize = function() {
  var l = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  if (l === 0) {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.w = 1;
  } else {
    l = 1 / l;
    this.x = this.x * l;
    this.y = this.y * l;
    this.z = this.z * l;
    this.w = this.w * l;
  }
};

/**
 * Convert this quaternion into its inverse.
 */
Quaternion.prototype.invert = function() {
  this.conjugate();
  this.normalize();
};

/**
 * Set the values of this quaternion to the product of itself and the given quaternion.
 *
 * @param q the quaternion to multiply with
 */
Quaternion.prototype.multiply = function(q) {
  var newX = this.x * q.w + this.y * q.z - this.z * q.y + this.w * q.x;
  var newY = -this.x * q.z + this.y * q.w + this.z * q.x + this.w * q.y;
  var newZ = this.x * q.y - this.y * q.x + this.z * q.w + this.w * q.z;
  var newW = -this.x * q.x - this.y * q.y - this.z * q.z + this.w * q.w;
  this.x = newX;
  this.y = newY;
  this.z = newZ;
  this.w = newW;
};

/**
 * Clone a copy of this quaternion.
 *
 * @returns the cloned quaternion
 */
Quaternion.prototype.clone = function() {
  return new Quaternion(this);
};

module.exports = Quaternion;

},{}],21:[function(require,module,exports){
/**
 * @fileoverview
 * @author David Gossow - dgossow@willowgarage.com
 */

var Vector3 = require('./Vector3');
var Quaternion = require('./Quaternion');

/**
 * A Transform in 3-space. Values are copied into this object.
 *
 *  @constructor
 *  @param options - object with following keys:
 *   * translation - the Vector3 describing the translation
 *   * rotation - the ROSLIB.Quaternion describing the rotation
 */
function Transform(options) {
  options = options || {};
  // Copy the values into this object if they exist
  this.translation = new Vector3(options.translation);
  this.rotation = new Quaternion(options.rotation);
}

/**
 * Clone a copy of this transform.
 *
 * @returns the cloned transform
 */
Transform.prototype.clone = function() {
  return new Transform(this);
};

module.exports = Transform;
},{"./Quaternion":20,"./Vector3":22}],22:[function(require,module,exports){
/**
 * @fileoverview
 * @author David Gossow - dgossow@willowgarage.com
 */

/**
 * A 3D vector.
 *
 *  @constructor
 *  @param options - object with following keys:
 *   * x - the x value
 *   * y - the y value
 *   * z - the z value
 */
function Vector3(options) {
  options = options || {};
  this.x = options.x || 0;
  this.y = options.y || 0;
  this.z = options.z || 0;
}

/**
 * Set the values of this vector to the sum of itself and the given vector.
 *
 * @param v the vector to add with
 */
Vector3.prototype.add = function(v) {
  this.x += v.x;
  this.y += v.y;
  this.z += v.z;
};

/**
 * Set the values of this vector to the difference of itself and the given vector.
 *
 * @param v the vector to subtract with
 */
Vector3.prototype.subtract = function(v) {
  this.x -= v.x;
  this.y -= v.y;
  this.z -= v.z;
};

/**
 * Multiply the given Quaternion with this vector.
 *
 * @param q - the quaternion to multiply with
 */
Vector3.prototype.multiplyQuaternion = function(q) {
  var ix = q.w * this.x + q.y * this.z - q.z * this.y;
  var iy = q.w * this.y + q.z * this.x - q.x * this.z;
  var iz = q.w * this.z + q.x * this.y - q.y * this.x;
  var iw = -q.x * this.x - q.y * this.y - q.z * this.z;
  this.x = ix * q.w + iw * -q.x + iy * -q.z - iz * -q.y;
  this.y = iy * q.w + iw * -q.y + iz * -q.x - ix * -q.z;
  this.z = iz * q.w + iw * -q.z + ix * -q.y - iy * -q.x;
};

/**
 * Clone a copy of this vector.
 *
 * @returns the cloned vector
 */
Vector3.prototype.clone = function() {
  return new Vector3(this);
};

module.exports = Vector3;
},{}],23:[function(require,module,exports){
module.exports = {
    Pose: require('./Pose'),
    Quaternion: require('./Quaternion'),
    Transform: require('./Transform'),
    Vector3: require('./Vector3')
};

},{"./Pose":19,"./Quaternion":20,"./Transform":21,"./Vector3":22}],24:[function(require,module,exports){
/**
 * Mixin a feature to the core/Ros prototype.
 * For example, mixin(Ros, ['Topic'], {Topic: <Topic>})
 * will add a topic bound to any Ros instances so a user
 * can call `var topic = ros.Topic({name: '/foo'});`
 *
 * @author Graeme Yeates - github.com/megawac
 */
module.exports = function(Ros, classes, features) {
    classes.forEach(function(className) {
        var Class = features[className];
        Ros.prototype[className] = function(options) {
            options.ros = this;
            return new Class(options);
        };
    });
};

},{}],25:[function(require,module,exports){
/**
 * @fileoverview
 * @author David Gossow - dgossow@willowgarage.com
 */

var ActionClient = require('../actionlib/ActionClient');
var Goal = require('../actionlib/Goal');

var Service = require('../core/Service.js');
var ServiceRequest = require('../core/ServiceRequest.js');

var Transform = require('../math/Transform');

/**
 * A TF Client that listens to TFs from tf2_web_republisher.
 *
 *  @constructor
 *  @param options - object with following keys:
 *   * ros - the ROSLIB.Ros connection handle
 *   * fixedFrame - the fixed frame, like /base_link
 *   * angularThres - the angular threshold for the TF republisher
 *   * transThres - the translation threshold for the TF republisher
 *   * rate - the rate for the TF republisher
 *   * updateDelay - the time (in ms) to wait after a new subscription
 *                   to update the TF republisher's list of TFs
 *   * topicTimeout - the timeout parameter for the TF republisher
 *   * serverName (optional) - the name of the tf2_web_republisher server
 *   * repubServiceName (optional) - the name of the republish_tfs service (non groovy compatibility mode only)
 *   																 default: '/republish_tfs'
 */
function TFClient(options) {
  options = options || {};
  this.ros = options.ros;
  this.fixedFrame = options.fixedFrame || '/base_link';
  this.angularThres = options.angularThres || 2.0;
  this.transThres = options.transThres || 0.01;
  this.rate = options.rate || 10.0;
  this.updateDelay = options.updateDelay || 50;
  var seconds = options.topicTimeout || 2.0;
  var secs = Math.floor(seconds);
  var nsecs = Math.floor((seconds - secs) * 1000000000);
  this.topicTimeout = {
    secs: secs,
    nsecs: nsecs
  };
  this.serverName = options.serverName || '/tf2_web_republisher';
  this.repubServiceName = options.repubServiceName || '/republish_tfs';

  this.currentGoal = false;
  this.currentTopic = false;
  this.frameInfos = {};
  this.republisherUpdateRequested = false;

  // Create an Action client
  this.actionClient = this.ros.ActionClient({
    serverName : this.serverName,
    actionName : 'tf2_web_republisher/TFSubscriptionAction',
    omitStatus : true,
    omitResult : true
  });

  // Create a Service client
  this.serviceClient = this.ros.Service({
    name: this.repubServiceName,
    serviceType: 'tf2_web_republisher/RepublishTFs'
  });
}

/**
 * Process the incoming TF message and send them out using the callback
 * functions.
 *
 * @param tf - the TF message from the server
 */
TFClient.prototype.processTFArray = function(tf) {
  var that = this;
  tf.transforms.forEach(function(transform) {
    var frameID = transform.child_frame_id;
    if (frameID[0] === '/')
    {
      frameID = frameID.substring(1);
    }
    var info = this.frameInfos[frameID];
    if (info) {
      info.transform = new Transform({
        translation : transform.transform.translation,
        rotation : transform.transform.rotation
      });
      info.cbs.forEach(function(cb) {
        cb(info.transform);
      });
    }
  }, this);
};

/**
 * Create and send a new goal (or service request) to the tf2_web_republisher
 * based on the current list of TFs.
 */
TFClient.prototype.updateGoal = function() {
  var goalMessage = {
    source_frames : Object.keys(this.frameInfos),
    target_frame : this.fixedFrame,
    angular_thres : this.angularThres,
    trans_thres : this.transThres,
    rate : this.rate
  };

  // if we're running in groovy compatibility mode (the default)
  // then use the action interface to tf2_web_republisher
  if(this.ros.groovyCompatibility) {
    if (this.currentGoal) {
      this.currentGoal.cancel();
    }
    this.currentGoal = new Goal({
      actionClient : this.actionClient,
      goalMessage : goalMessage
    });

    this.currentGoal.on('feedback', this.processTFArray.bind(this));
    this.currentGoal.send();
  }
  else {
    // otherwise, use the service interface
    // The service interface has the same parameters as the action,
    // plus the timeout
    goalMessage.timeout = this.topicTimeout;
    var request = new ServiceRequest(goalMessage);

    this.serviceClient.callService(request, this.processResponse.bind(this));
  }

  this.republisherUpdateRequested = false;
};

/**
 * Process the service response and subscribe to the tf republisher
 * topic
 *
 * @param response the service response containing the topic name
 */
TFClient.prototype.processResponse = function(response) {
  // if we subscribed to a topic before, unsubscribe so
  // the republisher stops publishing it
  if (this.currentTopic) {
    this.currentTopic.unsubscribe();
  }

  this.currentTopic = this.ros.Topic({
    name: response.topic_name,
    messageType: 'tf2_web_republisher/TFArray'
  });
  this.currentTopic.subscribe(this.processTFArray.bind(this));
};

/**
 * Subscribe to the given TF frame.
 *
 * @param frameID - the TF frame to subscribe to
 * @param callback - function with params:
 *   * transform - the transform data
 */
TFClient.prototype.subscribe = function(frameID, callback) {
  // remove leading slash, if it's there
  if (frameID[0] === '/')
  {
    frameID = frameID.substring(1);
  }
  // if there is no callback registered for the given frame, create emtpy callback list
  if (!this.frameInfos[frameID]) {
    this.frameInfos[frameID] = {
      cbs: []
    };
    if (!this.republisherUpdateRequested) {
      setTimeout(this.updateGoal.bind(this), this.updateDelay);
      this.republisherUpdateRequested = true;
    }
  }
  // if we already have a transform, call back immediately
  else if (this.frameInfos[frameID].transform) {
    callback(this.frameInfos[frameID].transform);
  }
  this.frameInfos[frameID].cbs.push(callback);
};

/**
 * Unsubscribe from the given TF frame.
 *
 * @param frameID - the TF frame to unsubscribe from
 * @param callback - the callback function to remove
 */
TFClient.prototype.unsubscribe = function(frameID, callback) {
  // remove leading slash, if it's there
  if (frameID[0] === '/')
  {
    frameID = frameID.substring(1);
  }
  var info = this.frameInfos[frameID];
  for (var cbs = info && info.cbs || [], idx = cbs.length; idx--;) {
    if (cbs[idx] === callback) {
      cbs.splice(idx, 1);
    }
  }
  if (!callback || cbs.length === 0) {
    delete this.frameInfos[frameID];
  }
};

/**
 * Unsubscribe and unadvertise all topics associated with this TFClient.
 */
TFClient.prototype.dispose = function() {
  this.actionClient.dispose();
  if (this.currentTopic) {
    this.currentTopic.unsubscribe();
  }
};

module.exports = TFClient;

},{"../actionlib/ActionClient":5,"../actionlib/Goal":7,"../core/Service.js":13,"../core/ServiceRequest.js":14,"../math/Transform":21}],26:[function(require,module,exports){
var Ros = require('../core/Ros');
var mixin = require('../mixin');

var tf = module.exports = {
    TFClient: require('./TFClient')
};

mixin(Ros, ['TFClient'], tf);
},{"../core/Ros":12,"../mixin":24,"./TFClient":25}],27:[function(require,module,exports){
/**
 * @fileOverview 
 * @author Benjamin Pitzer - ben.pitzer@gmail.com
 * @author Russell Toris - rctoris@wpi.edu
 */

var Vector3 = require('../math/Vector3');
var UrdfTypes = require('./UrdfTypes');

/**
 * A Box element in a URDF.
 *
 * @constructor
 * @param options - object with following keys:
 *  * xml - the XML element to parse
 */
function UrdfBox(options) {
  this.dimension = null;
  this.type = UrdfTypes.URDF_BOX;

  // Parse the xml string
  var xyz = options.xml.getAttribute('size').split(' ');
  this.dimension = new Vector3({
    x : parseFloat(xyz[0]),
    y : parseFloat(xyz[1]),
    z : parseFloat(xyz[2])
  });
}

module.exports = UrdfBox;
},{"../math/Vector3":22,"./UrdfTypes":36}],28:[function(require,module,exports){
/**
 * @fileOverview 
 * @author Benjamin Pitzer - ben.pitzer@gmail.com
 * @author Russell Toris - rctoris@wpi.edu
 */

/**
 * A Color element in a URDF.
 *
 * @constructor
 * @param options - object with following keys:
 *  * xml - the XML element to parse
 */
function UrdfColor(options) {
  // Parse the xml string
  var rgba = options.xml.getAttribute('rgba').split(' ');
  this.r = parseFloat(rgba[0]);
  this.g = parseFloat(rgba[1]);
  this.b = parseFloat(rgba[2]);
  this.a = parseFloat(rgba[3]);
}

module.exports = UrdfColor;
},{}],29:[function(require,module,exports){
/**
 * @fileOverview 
 * @author Benjamin Pitzer - ben.pitzer@gmail.com
 * @author Russell Toris - rctoris@wpi.edu
 */

var UrdfTypes = require('./UrdfTypes');

/**
 * A Cylinder element in a URDF.
 *
 * @constructor
 * @param options - object with following keys:
 *  * xml - the XML element to parse
 */
function UrdfCylinder(options) {
  this.type = UrdfTypes.URDF_CYLINDER;
  this.length = parseFloat(options.xml.getAttribute('length'));
  this.radius = parseFloat(options.xml.getAttribute('radius'));
}

module.exports = UrdfCylinder;
},{"./UrdfTypes":36}],30:[function(require,module,exports){
/**
 * @fileOverview
 * @author David V. Lu!!  davidvlu@gmail.com
 */

/**
 * A Joint element in a URDF.
 *
 * @constructor
 * @param options - object with following keys:
 *  * xml - the XML element to parse
 */
function UrdfJoint(options) {
  this.name = options.xml.getAttribute('name');
  this.type = options.xml.getAttribute('type');

  var parents = options.xml.getElementsByTagName('parent');
  if(parents.length > 0) {
    this.parent = parents[0].getAttribute('link');
  }

  var children = options.xml.getElementsByTagName('child');
  if(children.length > 0) {
    this.child = children[0].getAttribute('link');
  }

  var limits = options.xml.getElementsByTagName('limit');
  if (limits.length > 0) {
    this.minval = parseFloat( limits[0].getAttribute('lower') );
    this.maxval = parseFloat( limits[0].getAttribute('upper') );
  }
}

module.exports = UrdfJoint;

},{}],31:[function(require,module,exports){
/**
 * @fileOverview 
 * @author Benjamin Pitzer - ben.pitzer@gmail.com
 * @author Russell Toris - rctoris@wpi.edu
 */

var UrdfVisual = require('./UrdfVisual');

/**
 * A Link element in a URDF.
 *
 * @constructor
 * @param options - object with following keys:
 *  * xml - the XML element to parse
 */
function UrdfLink(options) {
  this.name = options.xml.getAttribute('name');
  this.visuals = [];
  var visuals = options.xml.getElementsByTagName('visual');

  for( var i=0; i<visuals.length; i++ ) {
    this.visuals.push( new UrdfVisual({
      xml : visuals[i]
    }) );
  }
}

module.exports = UrdfLink;
},{"./UrdfVisual":37}],32:[function(require,module,exports){
/**
 * @fileOverview 
 * @author Benjamin Pitzer - ben.pitzer@gmail.com
 * @author Russell Toris - rctoris@wpi.edu
 */

var UrdfColor = require('./UrdfColor');

/**
 * A Material element in a URDF.
 *
 * @constructor
 * @param options - object with following keys:
 *  * xml - the XML element to parse
 */
function UrdfMaterial(options) {
  this.textureFilename = null;
  this.color = null;

  this.name = options.xml.getAttribute('name');

  // Texture
  var textures = options.xml.getElementsByTagName('texture');
  if (textures.length > 0) {
    this.textureFilename = textures[0].getAttribute('filename');
  }

  // Color
  var colors = options.xml.getElementsByTagName('color');
  if (colors.length > 0) {
    // Parse the RBGA string
    this.color = new UrdfColor({
      xml : colors[0]
    });
  }
}

UrdfMaterial.prototype.isLink = function() {
  return this.color === null && this.textureFilename === null;
};

var assign = require('object-assign');

UrdfMaterial.prototype.assign = function(obj) {
    return assign(this, obj);
};

module.exports = UrdfMaterial;

},{"./UrdfColor":28,"object-assign":2}],33:[function(require,module,exports){
/**
 * @fileOverview 
 * @author Benjamin Pitzer - ben.pitzer@gmail.com
 * @author Russell Toris - rctoris@wpi.edu
 */

var Vector3 = require('../math/Vector3');
var UrdfTypes = require('./UrdfTypes');

/**
 * A Mesh element in a URDF.
 *
 * @constructor
 * @param options - object with following keys:
 *  * xml - the XML element to parse
 */
function UrdfMesh(options) {
  this.scale = null;

  this.type = UrdfTypes.URDF_MESH;
  this.filename = options.xml.getAttribute('filename');

  // Check for a scale
  var scale = options.xml.getAttribute('scale');
  if (scale) {
    // Get the XYZ
    var xyz = scale.split(' ');
    this.scale = new Vector3({
      x : parseFloat(xyz[0]),
      y : parseFloat(xyz[1]),
      z : parseFloat(xyz[2])
    });
  }
}

module.exports = UrdfMesh;
},{"../math/Vector3":22,"./UrdfTypes":36}],34:[function(require,module,exports){
/**
 * @fileOverview 
 * @author Benjamin Pitzer - ben.pitzer@gmail.com
 * @author Russell Toris - rctoris@wpi.edu
 */

var UrdfMaterial = require('./UrdfMaterial');
var UrdfLink = require('./UrdfLink');
var UrdfJoint = require('./UrdfJoint');
var DOMParser = require('xmldom').DOMParser;

// See https://developer.mozilla.org/docs/XPathResult#Constants
var XPATH_FIRST_ORDERED_NODE_TYPE = 9;

/**
 * A URDF Model can be used to parse a given URDF into the appropriate elements.
 *
 * @constructor
 * @param options - object with following keys:
 *  * xml - the XML element to parse
 *  * string - the XML element to parse as a string
 */
function UrdfModel(options) {
  options = options || {};
  var xmlDoc = options.xml;
  var string = options.string;
  this.materials = {};
  this.links = {};
  this.joints = {};

  // Check if we are using a string or an XML element
  if (string) {
    // Parse the string
    var parser = new DOMParser();
    xmlDoc = parser.parseFromString(string, 'text/xml');
  }

  // Initialize the model with the given XML node.
  // Get the robot tag
  var robotXml = xmlDoc.documentElement;

  // Get the robot name
  this.name = robotXml.getAttribute('name');

  // Parse all the visual elements we need
  for (var nodes = robotXml.childNodes, i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    if (node.tagName === 'material') {
      var material = new UrdfMaterial({
        xml : node
      });
      // Make sure this is unique
      if (this.materials[material.name] !== void 0) {
        if( this.materials[material.name].isLink() ) {
          this.materials[material.name].assign( material );
        } else {
          console.warn('Material ' + material.name + 'is not unique.');
        }
      } else {
        this.materials[material.name] = material;
      }
    } else if (node.tagName === 'link') {
      var link = new UrdfLink({
        xml : node
      });
      // Make sure this is unique
      if (this.links[link.name] !== void 0) {
        console.warn('Link ' + link.name + ' is not unique.');
      } else {
        // Check for a material
        for( var j=0; j<link.visuals.length; j++ )
        {
          var mat = link.visuals[j].material; 
          if ( mat !== null ) {
            if (this.materials[mat.name] !== void 0) {
              link.visuals[j].material = this.materials[mat.name];
            } else {
              this.materials[mat.name] = mat;
            }
          }
        }

        // Add the link
        this.links[link.name] = link;
      }
    } else if (node.tagName === 'joint') {
      var joint = new UrdfJoint({
        xml : node
      });
      this.joints[joint.name] = joint;
    }
  }
}

module.exports = UrdfModel;

},{"./UrdfJoint":30,"./UrdfLink":31,"./UrdfMaterial":32,"xmldom":42}],35:[function(require,module,exports){
/**
 * @fileOverview 
 * @author Benjamin Pitzer - ben.pitzer@gmail.com
 * @author Russell Toris - rctoris@wpi.edu
 */

var UrdfTypes = require('./UrdfTypes');

/**
 * A Sphere element in a URDF.
 *
 * @constructor
 * @param options - object with following keys:
 *  * xml - the XML element to parse
 */
function UrdfSphere(options) {
  this.type = UrdfTypes.URDF_SPHERE;
  this.radius = parseFloat(options.xml.getAttribute('radius'));
}

module.exports = UrdfSphere;
},{"./UrdfTypes":36}],36:[function(require,module,exports){
module.exports = {
	URDF_SPHERE : 0,
	URDF_BOX : 1,
	URDF_CYLINDER : 2,
	URDF_MESH : 3
};

},{}],37:[function(require,module,exports){
/**
 * @fileOverview 
 * @author Benjamin Pitzer - ben.pitzer@gmail.com
 * @author Russell Toris - rctoris@wpi.edu
 */

var Pose = require('../math/Pose');
var Vector3 = require('../math/Vector3');
var Quaternion = require('../math/Quaternion');

var UrdfCylinder = require('./UrdfCylinder');
var UrdfBox = require('./UrdfBox');
var UrdfMaterial = require('./UrdfMaterial');
var UrdfMesh = require('./UrdfMesh');
var UrdfSphere = require('./UrdfSphere');

/**
 * A Visual element in a URDF.
 *
 * @constructor
 * @param options - object with following keys:
 *  * xml - the XML element to parse
 */
function UrdfVisual(options) {
  var xml = options.xml;
  this.origin = null;
  this.geometry = null;
  this.material = null;

  // Origin
  var origins = xml.getElementsByTagName('origin');
  if (origins.length === 0) {
    // use the identity as the default
    this.origin = new Pose();
  } else {
    // Check the XYZ
    var xyz = origins[0].getAttribute('xyz');
    var position = new Vector3();
    if (xyz) {
      xyz = xyz.split(' ');
      position = new Vector3({
        x : parseFloat(xyz[0]),
        y : parseFloat(xyz[1]),
        z : parseFloat(xyz[2])
      });
    }

    // Check the RPY
    var rpy = origins[0].getAttribute('rpy');
    var orientation = new Quaternion();
    if (rpy) {
      rpy = rpy.split(' ');
      // Convert from RPY
      var roll = parseFloat(rpy[0]);
      var pitch = parseFloat(rpy[1]);
      var yaw = parseFloat(rpy[2]);
      var phi = roll / 2.0;
      var the = pitch / 2.0;
      var psi = yaw / 2.0;
      var x = Math.sin(phi) * Math.cos(the) * Math.cos(psi) - Math.cos(phi) * Math.sin(the)
          * Math.sin(psi);
      var y = Math.cos(phi) * Math.sin(the) * Math.cos(psi) + Math.sin(phi) * Math.cos(the)
          * Math.sin(psi);
      var z = Math.cos(phi) * Math.cos(the) * Math.sin(psi) - Math.sin(phi) * Math.sin(the)
          * Math.cos(psi);
      var w = Math.cos(phi) * Math.cos(the) * Math.cos(psi) + Math.sin(phi) * Math.sin(the)
          * Math.sin(psi);

      orientation = new Quaternion({
        x : x,
        y : y,
        z : z,
        w : w
      });
      orientation.normalize();
    }
    this.origin = new Pose({
      position : position,
      orientation : orientation
    });
  }

  // Geometry
  var geoms = xml.getElementsByTagName('geometry');
  if (geoms.length > 0) {
    var geom = geoms[0];
    var shape = null;
    // Check for the shape
    for (var i = 0; i < geom.childNodes.length; i++) {
      var node = geom.childNodes[i];
      if (node.nodeType === 1) {
        shape = node;
        break;
      }
    }
    // Check the type
    var type = shape.nodeName;
    if (type === 'sphere') {
      this.geometry = new UrdfSphere({
        xml : shape
      });
    } else if (type === 'box') {
      this.geometry = new UrdfBox({
        xml : shape
      });
    } else if (type === 'cylinder') {
      this.geometry = new UrdfCylinder({
        xml : shape
      });
    } else if (type === 'mesh') {
      this.geometry = new UrdfMesh({
        xml : shape
      });
    } else {
      console.warn('Unknown geometry type ' + type);
    }
  }

  // Material
  var materials = xml.getElementsByTagName('material');
  if (materials.length > 0) {
    this.material = new UrdfMaterial({
      xml : materials[0]
    });
  }
}

module.exports = UrdfVisual;
},{"../math/Pose":19,"../math/Quaternion":20,"../math/Vector3":22,"./UrdfBox":27,"./UrdfCylinder":29,"./UrdfMaterial":32,"./UrdfMesh":33,"./UrdfSphere":35}],38:[function(require,module,exports){
module.exports = require('object-assign')({
    UrdfBox: require('./UrdfBox'),
    UrdfColor: require('./UrdfColor'),
    UrdfCylinder: require('./UrdfCylinder'),
    UrdfLink: require('./UrdfLink'),
    UrdfMaterial: require('./UrdfMaterial'),
    UrdfMesh: require('./UrdfMesh'),
    UrdfModel: require('./UrdfModel'),
    UrdfSphere: require('./UrdfSphere'),
    UrdfVisual: require('./UrdfVisual')
}, require('./UrdfTypes'));

},{"./UrdfBox":27,"./UrdfColor":28,"./UrdfCylinder":29,"./UrdfLink":31,"./UrdfMaterial":32,"./UrdfMesh":33,"./UrdfModel":34,"./UrdfSphere":35,"./UrdfTypes":36,"./UrdfVisual":37,"object-assign":2}],39:[function(require,module,exports){
(function (global){
module.exports = global.WebSocket;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],40:[function(require,module,exports){
/* global document */
module.exports = function Canvas() {
	return document.createElement('canvas');
};
},{}],41:[function(require,module,exports){
(function (global){
/**
 * @fileOverview
 * @author Graeme Yeates - github.com/megawac
 */

'use strict';

var Canvas = require('canvas');
var Image = Canvas.Image || global.Image;

/**
 * If a message was compressed as a PNG image (a compression hack since
 * gzipping over WebSockets * is not supported yet), this function places the
 * "image" in a canvas element then decodes the * "image" as a Base64 string.
 *
 * @private
 * @param data - object containing the PNG data.
 * @param callback - function with params:
 *   * data - the uncompressed data
 */
function decompressPng(data, callback) {
  // Uncompresses the data before sending it through (use image/canvas to do so).
  var image = new Image();
  // When the image loads, extracts the raw data (JSON message).
  image.onload = function() {
    // Creates a local canvas to draw on.
    var canvas = new Canvas();
    var context = canvas.getContext('2d');

    // Sets width and height.
    canvas.width = image.width;
    canvas.height = image.height;

    // Prevents anti-aliasing and loosing data
    context.imageSmoothingEnabled = false;
    context.webkitImageSmoothingEnabled = false;
    context.mozImageSmoothingEnabled = false;

    // Puts the data into the image.
    context.drawImage(image, 0, 0);
    // Grabs the raw, uncompressed data.
    var imageData = context.getImageData(0, 0, image.width, image.height).data;

    // Constructs the JSON.
    var jsonData = '';
    for (var i = 0; i < imageData.length; i += 4) {
      // RGB
      jsonData += String.fromCharCode(imageData[i], imageData[i + 1], imageData[i + 2]);
    }
    callback(JSON.parse(jsonData));
  };
  // Sends the image data to load.
  image.src = 'data:image/png;base64,' + data;
}

module.exports = decompressPng;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"canvas":40}],42:[function(require,module,exports){
(function (global){
exports.DOMImplementation = global.DOMImplementation;
exports.XMLSerializer = global.XMLSerializer;
exports.DOMParser = global.DOMParser;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[4]);
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//



;
