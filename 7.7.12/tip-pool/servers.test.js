describe("Servers.js tests (with setup and tear-down)", function() {
  beforeEach(function () {
    // initialization logic
    serverNameInput.value = 'Alice';
  });

  it('should add a new server to allServers on submitServerInfo()', function () {
    submitServerInfo();

    expect(Object.keys(allServers).length).toEqual(1);
    expect(allServers['server' + serverId].serverName).toEqual('Alice');
  });

  it('should clear the input fields after accepting a server input via submitServerInfo()', () => {
    submitServerInfo();

    expect(serverNameInput.value).toEqual("");
  });

  it('should not accept a blank server input via submitServerInfo()', () => {
    serverNameInput.value = "";

    submitServerInfo();
    expect(Object.keys(allServers).length).toEqual(0);
  });

  it('should update the #serverTable table element when updateServerTable() runs', () => {
    submitServerInfo();
    updateServerTable();

    let newTableElements = document.querySelectorAll("#serverTable tbody tr td");

    expect(newTableElements[0].innerText).toEqual('Alice');
    expect(newTableElements[1].innerText).toEqual('$0.00');
  });

  afterEach(function() {
    allServers = {};
    serverId = 0;
    serverTbody.innerHTML = "";
    serverNameInput.value = "";
  });
});