;(function (DOM) {
  function app() {
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
      return $inputCEP.get()[0].value.replace(/\D/g, '')
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
      var parsedResponse = JSON.parse(ajax.responseText)
      return ajax.readyState === 4 && parsedResponse.status === 400
    }

    function fillCEPFields() {
      var data = parseData()
      if (!data) {
        getMessage('error')
        data = clearData()
      }

      $logradouro.get()[0].textContent = data.address
      $bairro.get()[0].textContent = data.district
      $estado.get()[0].textContent = data.state
      $cidade.get()[0].textContent = data.city
      $cep.get()[0].textContent = data.code
    }

    function clearData() {
      return {
        address: '-',
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

    return {
      getMessage: getMessage,
      replaceCEP: replaceCEP
    }
  }

  window.app = app()
  app()
})(window.DOM)
