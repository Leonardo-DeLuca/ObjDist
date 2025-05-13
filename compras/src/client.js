const path = require('path');
const fs = require('fs');
const soap = require('soap');

const wsdlUrl = path.join(__dirname, '..', 'wsdl', 'transportador.wsdl');

const wsdlXml = fs.readFileSync(wsdlUrl, 'utf8');

soap.createClient(wsdlUrl, {}, (err, client) => {
  if (err) {
    console.error('Erro ao criar cliente SOAP:', err);
    return;
  }

  client.setEndpoint('http://localhost:3000/soap');

  const novoPedido = {
    pedido: {
      numeroPedido: '12345',
      itens: JSON.stringify(['itemA', 'itemB']),
      quantidades: JSON.stringify([2, 5]),
      endereco: 'Rua Exemplo, 100',
      destinatario: 'João Silva'
    }
  };

  client.RegistrarPedido(novoPedido, (err, result) => {
    if (err) {
      console.error('Erro ao registrar pedido:', err);
    } else {
      console.log('Resposta RegistrarPedido:', result.resposta);
    }

    client.ConsultarStatus({ numeroPedido: '12345' }, (err, statusRes) => {
      if (err) {
        console.error('Erro ao consultar status:', err);
      } else {
        console.log('Status do pedido:', statusRes.status);
      }

      client.AtualizarStatus(
        { numeroPedido: '12345', novoStatus: 'Em transporte' },
        (err, updRes) => {
          if (err) {
            console.error('Erro ao atualizar status:', err);
          } else {
            console.log('Resposta AtualizarStatus:', updRes.resposta);
          }
        }
      );
    });
  });
});
