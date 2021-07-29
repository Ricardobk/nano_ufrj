# Exemplo de integração do p5js com paho mqtt

Essa sessão ensina como criar um arquivo html básico com um sketch em p5js que utiliza a biblioteca paho mqtt.

p5js é uma biblioteca gráfica em javascript.
paho-mqtt é a biblioteca com a implementação do protocolo mqtt para javascript.
Essas duas bibliotecas não são nativas do javascript e precisam ser carregadas de fora. O jeito mais correto de fazer isso é via download de seus arquivos, mas faremos isso carregando em tempo de execução para facilitar a implementação.

Javascript é uma linguagem que roda em qualquer browser. Precisamos apenas de um arquivo html que o browser utilizará para ler o que desejamos.
Segue o index.html que contém todas as informações necessárias para esse simples exemplo.

###index.html:
``` html
<html>
  <head>
    <meta content="text/html;charset=utf-8" http-equiv="Content-Type">
    <meta content="utf-8" http-equiv="encoding">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.0.1/mqttws31.js" type="text/javascript"></script>
    <script src="https://cdn.jsdelivr.net/npm/p5@1.4.0/lib/p5.js"></script>
    <script src="sketch.js"></script>
  </head>
  <body>
    <main>
    </main>
  </body>
</html>
```
As linhas iniciadas por script src são onde passamos o caminho para os arquivos javascript que desejamos utilizar. Os dois primeiros carregam o mqtt e o p5js respectivamente a partir de urls públicas.
O terceiro carrega o nosso sketch. Do jeito que está referenciado, 'index.html' e 'sketch.js' precisam estar no mesmo local, isto é, na mesma pasta.

A implementação do sketch de integração a seguir está completamente comentado e tenta passar a lógica de criação de cenas no p5js atentando para as regras do ambiente.
O sketch tem as seguintes funcionalidades:
- Cria 3 círculos na tela, inicialmente amarelos, em que cada um referencia um dos tópicos que estamos ouvindo.

- Os círculos se movem em um sentido inicial com uma velocidade inicial.

- Quando uma mensagem é recebida por um tópico, o círculo que referencia o tópico muda para uma cor aleatória e acelera um pouco, até um limite.

- Clicando em um dos círculos, recebemos no console do browser (checar como acessar para o seu browser) a lista de mensagens recebidas por aquele tópico.

Para ver as mensagens sendo recebidas, pode se executar o arquivo em python apresentado em 'tutorial_clientes.md' ou implementar o envio em sketch.js mesmo.
###sketch.js:
``` javascript
//Caso já tenha conhecimento em orientação a objetos em outra linguagem, é preciso tomar cuidado com classes em javascript. Aqui o termo class é apenas 'syntactic sugar' e sua implementação é profundamente diferente de outras linguagens com suporte a OOP.
//Caso o leitor não tenha, pode se entender a classe aqui apenas como um objeto com propriedades próprias. Cada objeto desenhado na tela possui informações próprias como sua posição. O jeito mais correto e organizado de manter múltiplos objetos em uma cena é criando classes para cada um dos grupos e mantendo um vetor que contém a coleção de objetos de uma dada classe.
// Para desenhar, percorremos o vetor na função draw e chamamos o método desejado para cada objeto.
// A classe Topic contém todas as informações e metódos que utilizaremos na construção da nossa cena. Se tivessem outros objetos de outra natureza, seriam necessárias novas classes.
class Topic
{
        //Cria uma nova instância do objeto. Recebe os parâmetros passados e atualiza seus valores pessoais com eles. Para os outros valores pessoais de cada instância aqui definidos estamos usando um valor padrão.
        //Os valores individuais de cada instância são referenciados com 'this'.
        constructor(x, y, d, name)
        {
             this.x = x;
             this.y = y;
             this.d = d;
             this.name = name;
             this.color = [255, 204, 0];
             this.log = [];
             this.factor = 1;
        }

        //Método que constrói o objeto na tela
        build()
        {

             fill(color(this.color[0], this.color[1], this.color[2])); // Em p5js, primeiro definimos as propriedade e depois chamamos a função de criação do objeto em questão. Aqui estamos passando um array no espectro                                                                          // RGB, que define a cor atual dessa instância.
             circle(this.x, this.y, this.d);                           // Função do p5js para criação de um círculo. Não esqueça de ler a doc com as referências quando for fazer seus próprios códigos.

             fill('black'); // daqui em diante não queremos mais a cor usada anteriormente, mas sim preto.
             text(this.name, this.x, this.y+this.d/2+10); // coloca o nome do tópico (this.name) na posição x, y definida pelos parâmetros seguintes.
        }

        //Método que "move" o objeto. Isso é feito atualizando o x e/ou y que serão utilizados pelo método build. Redesenhando o objeto em uma nova posição e apagando o antigo, como será feito mais a frente, temos a sensação de movimento.
        step(stepSize)
        {
             //Se o círculo está prestes a sair da tela, mova para o lado contrário.
             if(this.x + this.d/2 + stepSize > windowWidth || this.x - this.d/2 - stepSize < 0)
                 this.factor *= -1;
             this.x += stepSize * this.factor;
        }
}


var topics = [];

// preLoad serve como o fluxo de coisas que devem executar antes de o código começar. É geralmente utilizado para carregamento de arquivos.
function preload() {
}
//

// Configurações de partida. Executa uma vez no começo do código.
function setup()
{
  client = new Paho.MQTT.Client("test.mosquitto.org", Number(8080), 'nano'); // Cria um novo client já setando o broker destino, a porta e o clientId
  client.onMessageArrived = onMessageArrived; // callback para mensagens recebidas com a função criada por nós.
  
  //configurações do client
  client.connect({onSuccess:onConnect,
                  userName: 'public', 
                  password: 'public', 
                  })
  //
  createCanvas(windowWidth, windowHeight); // Cria a tela onde os objetos são desenhados. Objetos só podem ser renderizados se estiverem dentro da área do canvas.
                                           // windowWidth e windowHeight são duas variáveis do sistema utilizados para pegar o tamanho da tela onde o código está rodando. Ex: Se adapta ao tamanho da tela de um celular ou d                                           //   e um notebook.
  initialize_topics();
}
//

// Executa uma vez a cada frame/intervalo de tempo. Elementos que devem ser constantemente redesenhados ou atualizados devem estar nessa função.
function draw()
{
  clear(); // clear a cada nova execução para não deixar resquícios dos objetos que se movem.
           //background("white") seria uma opção também;

  for(var i = 0; i < topics.length; i++) // percorre todos os tópicos.
  {
        topics[i].step((topics[i].log.length + 1) % 10); //seta o tamanho do passo dado pelo círculo do tópico a cada passagem de Draw para ser baseado no número de mensagens recebidas, até um limite de 10 pixels.
        topics[i].build(); // Redesenha o tópico com as novas informações atualizadas.
  }
}
//

// Callback que será chamado quando conseguirmos conexão com o broker
function onConnect() {
  console.log("onConnect");
  client.subscribe("temperatura");
  client.subscribe("umidade");
  client.subscribe("luminosidade");
}
//

var dict = {"temperatura":0, "umidade":1, "luminosidade":2};

//Quando uma mensagem for recebida, executará o seguinte código
function onMessageArrived(message) {
  console.log("onMessageArrived:"+message.payloadString+" "+message.destinationName); // printa para o console do browser a mensagem recebida e o tópico-alvo.
  let index =  dict[message.destinationName]; // descobre a posição do tópico que recebeu a mensagem no vetor de tópicos.
  var newColor = [getRandomInt(0,255), getRandomInt(0,255), getRandomInt(0,255)]; // sorteia uma nova cor.
  topics[index].log.push(message.payloadString); // coloca a nova mensagem na lista de mensagens recebidas por um tópico.
  topics[index].color = newColor; // atualiza a cor do tópico que recebeu a mensagem.
}
//

// função built in do p5js que aciona no clique do Mouse
function mouseClicked() { 
        // Quando houver um clique, percorremos todos os nossos tópicos e checamos se a posição do clique está dentro da área de um dos nossos tópicos, se sim, printa a lista no console do browser.
        for (var i = 0; i < topics.length; i++) { 
                if(distance(topics[i].x, topics[i].y, mouseX, mouseY) < topics[i].d/2) { console.log(topics[i].log); } 
        } 
}
//


function distance(p1x, p1y, p2x, p2y) { return Math.sqrt((p1x - p2x)**2 + (p1y - p2y)**2); } // distância entre dois pontos. 
function getRandomInt(min, max) { return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min))) + Math.ceil(min);} // Randomiza inteiros em uma certa faixa.

//Coloca os tópicos iniciais no vetor com seus devidos parâmetros.
function initialize_topics() {
  topics.push(new Topic(windowWidth/2, windowHeight/2, 80, "temperatura"));
  topics.push(new Topic(windowWidth/2, windowHeight/4, 80, "umidade"));
  topics.push(new Topic(windowWidth/2, windowHeight/1.25, 80, "luminosidade"));
  topics[1].factor = topics[2].factor = -1;
}

``` 

Para ver a implementação basta executar o arquivo index.html em algum browser.
O exemplo foi construido usando firefox. Caso haja problemas com algum outro browser, favor informar.
