function newNavbarItem(text, url) {
  itemLink = document.createElement('a');
  itemLink.className = 'nav-item nav-link';
  itemLink.innerHTML = text;
  itemLink.href = url;

  return itemLink
}

function renderNavbar(user) {
  const navbarDiv = document.getElementById('nav-item-container');

  if (user._id) {
    navbarDiv.appendChild(newNavbarItem('Profile', '/u/profile?'+user._id));
    navbarDiv.appendChild(newNavbarItem('How it works', '/about'));
    navbarDiv.appendChild(newNavbarItem('Log out', '/logout'));
  } else {
    navbarDiv.appendChild(newNavbarItem('How it works', '/about'));
    navbarDiv.appendChild(newNavbarItem('Log in (MIT)', '/auth/mitopenid'));
    navbarDiv.appendChild(newNavbarItem('Log in (Google)', '/auth/google'));
  }
}
