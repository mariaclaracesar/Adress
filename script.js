function DOM(elements) {
  this.element = document.querySelectorAll(elements)
}

DOM.prototype.on = function on(eventType, callback) {
  this.element.forEach(function (element) {
    element.addEventListener(eventType, callback, false)
  })
}

DOM.prototype.off = function off(eventType, callback) {
  this.element.forEach(function (element) {
    element.removeEventListener(eventType, callback)
  })
}

DOM.prototype.get = function get() {
  return this.element
}

DOM.prototype.forEach = function forEach() {
  return Array.prototype.forEach.apply(this.element, arguments)
}

DOM.prototype.map = function map() {
  return Array.prototype.map.apply(this.element, arguments)
}

DOM.prototype.filter = function filter() {
  return Array.prototype.filter.apply(this.element, arguments)
}

DOM.prototype.reduce = function reduce() {
  return Array.prototype.reduce.apply(this.element, arguments)
}

DOM.prototype.reduceRight = function reduceRight() {
  return Array.prototype.reduceRight.apply(this.element, arguments)
}

DOM.prototype.every = function every() {
  return Array.prototype.every.apply(this.element, arguments)
}

DOM.prototype.some = function some() {
  return Array.prototype.some.apply(this.element, arguments)
}

DOM.isArray = function isArray(param) {
  return Object.prototype.toString.call(param) === '[object Array]'
}

DOM.isObject = function isObject(param) {
  return Object.prototype.toString.call(param) === '[object Object]'
}

DOM.isFunction = function isFunction(param) {
  return Object.prototype.toString.call(param) === '[object Function]'
}

DOM.isNumber = function isNumber(param) {
  return Object.prototype.toString.call(param) === '[object Number]'
}

DOM.isString = function isString(param) {
  return Object.prototype.toString.call(param) === '[object String]'
}

DOM.isBoolean = function isBoolean(param) {
  return Object.prototype.toString.call(param) === '[object Boolean]'
}

DOM.isNull = function isNull(param) {
  return (
    Object.prototype.toString.call(param) === '[object Null]' ||
    Object.prototype.toString.call(param) === '[object Undefined]'
  )
}

var $formCEP = new DOM('[data-js="form-cep"]')
var $inputCEP = new DOM('[data-js="input-cep"]')
var $logradouro = new DOM('[data-js="logradouro"]')
var $bairro = new DOM('[data-js="bairro"]')
var $estado = new DOM('[data-js="estado"]')
var $cidade = new DOM('[data-js="cidade"]')
var $cep = new DOM('[data-js="cep"]')
var $status = new DOM('[data-js="status"]')
var ajax = new XMLHttpRequest()
$formCEP.on('submit', handleSubmitFormCEP)

function handleSubmitFormCEP(event) {
  event.preventDefault()
  var url = getUrl()
  ajax.open('GET', url, true)
  ajax.send()
  getMessage('loading')
  ajax.addEventListener('readystatechange', handleReadyStateChange)
}

function getUrl() {
  return replaceCEP('https://ws.apicep.com/cep/[CEP].json')
}

function clearCEP() {
  return $inputCEP.get()[0].value.replace(/\D+/g, '')
}

function handleReadyStateChange() {
  if (isRequestOk()) {
    getMessage('ok')
    fillCEPFields()
  }

  if (isCEPInvalid()) {
    getMessage('error')
  }
}

function isRequestOk() {
  return ajax.readyState === 4 && ajax.status === 200
}

function isCEPInvalid() {
  return ajax.readyState === 4 && ajax.status === 0
}

function fillCEPFields() {
  var data = parseData()
  if (!data) {
    getMessage('error')
    data = clearData()
  }

  $logradouro.get()[0].textContent = data.adress
  $bairro.get()[0].textContent = data.district
  $estado.get()[0].textContent = data.state
  $cidade.get()[0].textContent = data.city
  $cep.get()[0].textContent = data.code
}

function clearData() {
  return {
    adress: '-',
    district: '-',
    state: '-',
    city: '-',
    code: '-'
  }
}

function parseData() {
  var result = JSON.parse(ajax.responseText)
  return result.erro ? null : result
}

function getMessage(type) {
  var messages = {
    loading: 'Buscando informações para o CEP [CEP]...',
    ok: 'Endereço referente ao CEP [CEP]:',
    error: 'Não encontramos o endereço para o CEP [CEP].'
  }

  $status.get()[0].textContent = replaceCEP(messages[type])
}

function replaceCEP(message) {
  return message.replace('[CEP]', clearCEP())
}
