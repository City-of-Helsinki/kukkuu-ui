import React from 'react';

import styles from './header.module.scss';
import Container from '../layout/Container';
import Navbar from './navbar/Navbar';

function Header() {
  return (
    <header className={styles.headerWrapper}>
      <Container>
        <Navbar />
      </Container>
    </header>
  );
}

export default Header;
