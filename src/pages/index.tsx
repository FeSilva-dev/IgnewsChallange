import { GetStaticProps } from 'next';
import Head  from 'next/head';
import Prismic from '@prismicio/client';
import { getPrismicClient } from '../services/prismic';
import {FiCalendar, FiUser} from 'react-icons/fi';
import Link from 'next/link';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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

export default function Home({postsPagination}: HomeProps) {
  const [posts, setPosts] = useState<Post[]>(postsPagination.results)
  const [nextPageUrl, setNextPageUrl] = useState<string>(postsPagination.next_page);

  async function getMorePosts(){
    if(!nextPageUrl){
      return;
    }
    
    try{
      const response = await fetch(nextPageUrl);
      const data = await response.json()

      const results = data.results.map((post) => {
        return {
          uid: post.uid,
          first_publication_date: post.first_publication_date,
          data: {
            title: post.data.title,
            subtitle: post.data.subtitle,
            author: post.data.author
          }
        }
      });

      setPosts([...posts, ...results]);
      setNextPageUrl(data.next_page)

    }catch(error){
      console.log(error)
    }
  }
  
  return(
    <>
      <Head>
        <title>spacetraveling</title>
      </Head>
      <main className={commonStyles.container}>
        <div className={styles.posts}>
          {posts.map((post: Post) => (
            <Link href={`/post/${post.uid}`} key={post.uid}>
              <a href="">
                <strong>{post.data.title}</strong>
                <p>
                  {post.data.subtitle}
                </p>
                <div className={styles.postInfo}>
                  <time>
                    <span>
                      <FiCalendar />
                    </span>
                    {format(new Date(post.first_publication_date), "d MMM yyyy", {
                      locale: ptBR,
                    })}
                  </time>
                  <p>
                    <span>
                      <FiUser />
                    </span>
                    {post.data.author}
                  </p>
                </div>
              </a>
            </Link>
          ))}
          {nextPageUrl && 
            <div className={styles.loadMore}>
              <button onClick={() => getMorePosts()}>Carregar mais posts</button>
            </div>
          }
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query([
    Prismic.predicates.at('document.type', 'ignewschallange')
  ], {
    fetch: ['ignewschallange.title', 'ignewschallange.subtitle', 'ignewschallange.author'],
    pageSize: 1,
  });

  const results = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author
      }
    }
  });

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results
      }
    }
  }
};
