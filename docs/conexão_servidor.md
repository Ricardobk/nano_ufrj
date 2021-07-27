Para demonstrar como um cliente pode se conectar com um broker para envio e recebimento de mensagens, utilizaremos como exemplo o seguinte código comentado em Python em que os números marcam os índices a serem apronfundados.

```Python
import paho.mqtt.client as paho ### 1 - importa uma biblioteca com a implementação do protocolo
import random
import time

topics = { 1:"temperatura", 2:"umidade", 3:"luminosidade"}

#### 2 - define a instância do cliente
client = paho.Client("bot")
client.username_pw_set(username="participants", password="prp1nterac")
#####

##### 5 - Callback functions
def on_message(client, userdata, message):
    print("received message =",str(message.payload.decode("utf-8")))

def on_publish(client,userdata,result):
    print("data published \n")
    pass
######

##### 3 - Conexao com o servidor
client.connect("146.164.26.62", 2494)
#####

#### 4 - Inscrição em tópicos
client.subscribe("temperatura")
client.subscribe("umidade")
client.subscribe("luminosidade")
#####

client.on_publish = on_publish ## 5
client.on_message = on_message ## 5

client.loop_start() ## Inicia o processo de troca de mensagens.

while(1):
        topic = random.randint(1,3)
        payload = str(random.randint(0,100))
        print(client.publish(topics[topic], payload))
        time.sleep(3.0)
```

1 - MQTT é um protocolo. Em outras palavras, um conjunto de regras ou um contrato que deve ser seguido por todas as partes. Para que seja possível usar o MQTT é preciso que essas regras sejam implementadas. No caso do python elas estão disponíveis na biblioteca Paho MQTT para python e pode ser baixado através do comando pip install paho-mqtt e importadas no código.

2 - Um cliente no MQTT é definido pelo seu clientID, no caso bot e pelo seu perfil. O servidor de broker precisa definir um username e um password para que clientes possam acessá-los através de um perfil. Um perfil define o conjunto de permissões que clientes do grupo tem no sistema. Um cenário ilustrativo disso seria definir username e password diferentes para os administradores do servidor e conceder a eles permissão completa, enquanto clientes poderiam apenas ouvir mensagens, mas não criar tópicos, por exemplo.
Portanto, para se conectar com qualquer servidor de broker é necessário um clientID e conhecimento do username e password do grupo no qual o requisitante se encaixa.

3 - Chama a função que de fato estabelece a conexão com o servidor, utilizando a instância do cliente previamente definida. No exemplo, o ip em questão é o do broker do NANO e o segundo parâmetro a porta que está sendo utilizada para ouvir essa forma de MQTT.
Um broker de MQTT pode ouvir as mensagens de algumas formas diferentes, como websockets, mqtt puro, encriptado ou não, entre outros. Cada uma dessas, quando disponíveis, recebem uma porta própria definida pelos desenvolvedores. Cabe a eles, portanto, divulgar as portas adequadas para os clientes.

4 - Toda as ações no MQTT são feitas vinculadas a tópicos. Não é possível ouvir ou enviar mensagens de um tópico do qual o cliente não é assinante.

5 - Funções de callback no linguajar técnico são funções que são passadas como parâmetro para outras funções. Aqui, é possível deixar isso de lado e entender que as callbacks do MQTT são os trechos de código que são ativados como resposta ao acontecimento de um certo evento do fluxo do MQTT. Alguns exemplos de possíveis eventos que cujo a callback function pode ser associada são quando a conexão com o broker é estabelecida, quando uma mensagem é enviada e processada pelo broker e quando uma mensagem é recebida pelo cliente.
Essa funcionalidade é opcional, visto que não é necessário definir resposta para todos os eventos, entretanto, no MQTT, a interação com esses eventos só pode ser feita através de callbacks e cabe ao cliente implementar o código que melhor lhe atende em cada evento.

Como dito anteriormente, MQTT é um protocolo. Portanto, não importa a linguagem ou ferramenta sendo utilizada, suas regras deverão ser respeitadas. Tendo conhecimento das regras, o uso em qualquer outro ambiente é apenas uma questão de adequação à sintaxe da ferramenta. O seguinte código para Processing de conexão ao broker do shiftr.io deixa claro esse ponto. Nele, marcamos as sessões referenciadas pelos índices anteriores.

``` Processing
#### 1 - Import de uma biblioteca com as regras já implementadas 
import mqtt.*;
######

#### 2 - Define a instância do cliente
MQTTClient client;
####

##### 3 - Conexão com o servidor
void setup() {
  client = new MQTTClient(this);
  client.connect("mqtt://public:public@public.cloud.shiftr.io", "processing"); ## Nesse caso, username e password são passados na url (public:public). "processing" é o clientId
  client.subscribe("hello"); ## 4 - Subscribe ao tópico "hello"
}


void draw() {}

void keyPressed() {
  client.publish("hello", "world");
}


### 5 - Callback para o evento de uma mensagem recebida.
void messageReceived(String topic, byte[] payload) {
  println( topic + ": " + new String(payload));
}
```

Como é possível ver, todas as etapas do código em Python são reproduzidas em Processing apenas com variação de sintaxe.
Uma dúvida pertinente é como proceder caso o passo 1, da biblioteca, não exista para uma dada ferramenta. Aqui duas opções são possíveis, a primeira é implementar o conjunto de regras que define o MQTT, o que é consideralvemente trabalhoso ou passar a etapa de comunicação com o broker para uma outra ferramenta e dessa de volta para a atual. A melhor forma para essa segunda opção precisa ser avaliada caso a caso.
