import commonStyles from '../../styles/common.module.scss';
import styles from './header.module.scss';
import { useRouter } from 'next/router';

export default function Header() {

  const router = useRouter()
  
  return(
    <header className={commonStyles.container}>
      <img 
        className={styles.headerImg}
        src="/logo.svg" 
        alt="logo" 
        onClick={() => router.push('/', '', {})} 
      />
    </header>
  )
}
