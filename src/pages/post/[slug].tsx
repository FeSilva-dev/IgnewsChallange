import { GetStaticPaths, GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import { getPrismicClient } from '../../services/prismic';

import {FiCalendar, FiClock, FiUser} from 'react-icons/fi';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { RichText } from 'prismic-dom';
import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';
import { useRouter } from 'next/router';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const router = useRouter();
  return(
    <>
      {router.isFallback 
      ? <p>Carregando...</p>
      : 
      <>
        <img src={post.data.banner.url} alt={post.data.title} className={styles.banner}/>
        <main className={commonStyles.container}>
          <article className={styles.post}>
            <h1>{post.data.title}</h1>

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

              <time>
                <span>
                <FiClock />
                </span>
                4 min
              </time>
            </div>

            <div className={styles.postContent}>
              {post.data.content.map((postBody, index) => (
                <div key={index} className={styles.postContent}>
                  <h2>{postBody.heading}</h2>
                  <div dangerouslySetInnerHTML={{ __html: RichText.asHtml(postBody.body)  }} />
                </div>
              ))}
            </div>

          </article>
        </main>
      </>
      }
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query([
    Prismic.predicates.at('document.type', 'ignewschallange')
  ]);

  const paths = posts.results.map(path => {
    return {
      params: {
        slug: path.uid,
      }
    }
  })

  return {
    paths,
    fallback: true
  }
};

export const getStaticProps: GetStaticProps = async ({params}) => {
  const { slug } = params;
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('ignewschallange', String(slug), {});

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url
      },
      subtitle: response.data.subtitle,
      author: response.data.author,
      content: response.data.content.map(content => {
        return {
          heading: content.heading,
          body: content.body
        }
      })
    },
  }

  console.log(post)

  return {
    props: {
      post
    }
  }
};
