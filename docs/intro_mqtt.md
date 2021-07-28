# Principais conceitos e definições sobre MQTT.

MQTT é um protocolo de rede exclusivamente voltado para troca de mensagens. Notório por sua simplicidade, é capaz de distribuir mensagens extremamente leves de maneira muito eficiente. 
Essa característica justifica sua crescente adesão em ambientes IoT, onde o poder de processamento costuma ser mais limitado.
A seguir é apresentado um resumo das principais regras e definições sobre o funcionamento do protocolo na perspectiva dos clientes:

- Um ambiente MQTT é organizado na forma de tópicos.

- Um cliente precisa necessariamente estar inscrito em um ou mais tópicos para poder interagir com o servidor. 

- A troca de mensagens se dá através dos tópicos, onde clientes enviam mensagens e elas são repassadas para todos os demais ouvintes do mesmo campo.

- O responsável por repassar as mensagens corretamente para todos os inscritos de um tópico é o Broker MQTT, que pode ser entendido como o servidor no qual os usuários se conectam para fazer parte de uma rede MQTT.

- Para se conectar com um servidor, é necessário um id e um username e password. O id é uma string utilizada pelo broker para identificar unicamente os clientes que precisam receber certa mensagem, enquanto o username e o password são definidos na implementação do broker e servem para separar os usuários em diferentes grupos, com diferentes permissionamentos.

- Um tópico pode ter subtópicos, p.ex: equipes/futebol/fluminense. O propósito disso é apenas possibilitar uma arquitetura organizada.

- Tópicos iniciados por $ são especiais e disponibilizam informações acerca do sistema geradas pelo broker.

- Mensagens: São os objetos que trafegam por uma rede MQTT. Suas propriedades essenciais são o payload ou corpo da mensagem; O tópico de origem/destino; Tamanho em bytes. Não é possível no MQTT determinar o cliente que enviou uma mensagem. Isso resultaria em mensagems com data frames maiores e mais complexos, ferindo o objetivo do MQTT.

- Persistência, confiabilidade, criptografia, e outros conceitos comuns a TCP/IP não são funcionalidades padrão no MQTT, mas podem ser implementadas e já existem como oferta em alguns dos principais brokers do mercado.

MQTT é, portanto, um protocolo de funcionalidade simples adequado para trocas em tempo real de dados dinâmicos. Diversas ferramentas e linguagens no mercado possuem implementação para o MQTT. Alguns exemplos são: Javascript, node js, Python, Processing, Max/MSP, Arduino e Pure Data.
