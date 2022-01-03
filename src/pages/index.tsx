import { GetStaticProps } from 'next';
import Head  from 'next/head';
import Header from '../components/Header';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home() {
  return(
    <>
      <Head>
        <title>spacetraveling</title>
      </Head>
      <main className={commonStyles.container}>
        <div className={styles.posts}>
          <a href="">
            <strong>Titulo do meu post</strong>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. 
              Quo accusantium quibusdam explicabo officia, odio dicta corrupti magnam, 
            </p>
            <div className={styles.postInfo}>
              <time>8 de Dezembro de 2021</time>
              <span>Felipe Teste</span>
            </div>
          </a>

          <a href="">
            <strong>Titulo do meu post</strong>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. 
              Quo accusantium quibusdam explicabo officia, odio dicta corrupti magnam, 
            </p>
            <div className={styles.postInfo}>
              <time>8 de Dezembro de 2021</time>
              <span>Felipe Teste</span>
            </div>
          </a>

          <a href="">
            <strong>Titulo do meu post</strong>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. 
              Quo accusantium quibusdam explicabo officia, odio dicta corrupti magnam, 
            </p>
            <div className={styles.postInfo}>
              <time>8 de Dezembro de 2021</time>
              <span>Felipe Teste</span>
            </div>
          </a>

          <div className={styles.loadMore}>
            <a href="">Carregar mais posts</a>
          </div>
        </div>
      </main>
    </>
  )
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
