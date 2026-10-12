# Tela Duo

Site mínimo para compartilhar a tela entre duas pessoas, com limite de 2 participantes por sala.

## Requisitos
- Node.js 18 ou mais recente
- Navegador atualizado (Chrome, Edge ou Firefox)

## Executar no computador
1. Extraia o ZIP.
2. Abra um terminal nesta pasta.
3. Execute `npm install`.
4. Execute `npm start`.
5. Abra `http://localhost:3000`.

Para duas pessoas em computadores diferentes, publique o app em um serviço que suporte Node.js e HTTPS. Compartilhe o mesmo código de sala com a outra pessoa. `getDisplayMedia` exige HTTPS fora de localhost.

## Observações
- A sinalização usa Socket.IO; áudio/vídeo trafega via WebRTC entre os navegadores quando a rede permite.
- Este exemplo usa um servidor STUN público e pode não conectar em algumas redes restritivas. Para confiabilidade maior, configure um servidor TURN.
- O limite de duas pessoas é aplicado por processo do servidor; para uso público, acrescente autenticação, rate limiting e outras proteções.
- A pessoa que compartilha escolhe explicitamente a tela/janela no diálogo do navegador. O site não captura a tela sem consentimento.
