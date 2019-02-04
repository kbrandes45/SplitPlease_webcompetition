function main() {
  get('/api/whoami', {}, function(user) {
		renderNavbar(user);
        renderStartRow(user);
		renderOrders(user);
  });
}

main();