/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import clsx from 'clsx';
import {MDXProvider} from '@mdx-js/react';
import Translate, {translate} from '@docusaurus/Translate';
import Link from '@docusaurus/Link';
import MDXComponents from '@theme/MDXComponents';
import Seo from '@theme/Seo';
import styles from './styles.module.css';
import {usePluralForm} from '@docusaurus/theme-common'; // Very simple pluralization: probably good enough for now
import TagsLogo from "../../assets/icons/blog-tags.svg";
import DateLogo from "../../assets/icons/blog-date.svg";

function useReadingTimePlural() {
  const {selectMessage} = usePluralForm();
  return (readingTimeFloat) => {
    const readingTime = Math.ceil(readingTimeFloat);
    return selectMessage(
      readingTime,
      translate(
        {
          id: 'theme.blog.post.readingTime.plurals',
          description:
            'Pluralized label for "{readingTime} min read". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',
          message: 'One min read|{readingTime} min read',
        },
        {
          readingTime,
        },
      ),
    );
  };
}

function BlogPostItem(props) {
  const readingTimePlural = useReadingTimePlural();
  const {
    children,
    frontMatter,
    metadata,
    truncated,
    isBlogPostPage = false,
  } = props;
  const {date, formattedDate, permalink, tags, readingTime} = metadata;
  const {author, title, image, keywords} = frontMatter;
  const authorURL = frontMatter.author_url || frontMatter.authorURL;
  const authorTitle = frontMatter.author_title || frontMatter.authorTitle;
  const authorImageURL =
    frontMatter.author_image_url || frontMatter.authorImageURL;

    const renderPostHeader = () => {
    const TitleHeading = isBlogPostPage ? 'h1' : 'h2';
    return (
      <header>
        <TitleHeading
          className={clsx('margin-bottom--sm', styles.blogPostTitle)}>
          {isBlogPostPage ? title : <Link to={permalink}>{title}</Link>}
        </TitleHeading>
        <div className={styles.postHeader}>
          <div className="avatar margin-bottom--md">
            <div className="avatar__intro">
              {author && (
                <>
                  <h4 className="avatar__name">
                    <Link href={authorURL} className={styles.authorName}>{`Author: ${author}`}</Link>
                  </h4>
                </>
              )}
            </div>
          </div>
          {author && <div className={`margin-bottom--md ${styles.line}`}>
            <div></div>
          </div>}
          <div className={`margin-bottom--md ${styles.headerDate} ${author && styles.marginLeft}`}>
            <DateLogo />
            <time dateTime={date} className={styles.blogPostDate}>
              {formattedDate}
              {readingTime && (
                <>
                  {' · '}
                  {readingTimePlural(readingTime)}
                </>
              )}
            </time>
          </div>
          {tags.length > 0 && <div className={`margin-bottom--md ${styles.line}`}>
            <div></div>
          </div>}
          <div className={`margin-bottom--md`}>
            {tags.length > 0 && (
              <div className={`col ${styles.headerTags}`}>
                <TagsLogo />
                {tags.map(({label, permalink: tagPermalink}) => (
                  <Link
                    key={tagPermalink}
                    className="margin-horiz--sm"
                    to={tagPermalink}>
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
        
      </header>
    );
  };

  return (
    <>
      <Seo
        {...{
          keywords,
          image,
        }}
      />

      <article className={!isBlogPostPage ? 'margin-bottom--xl' : undefined}>
        {renderPostHeader()}
        <div className="markdown">
          <MDXProvider components={MDXComponents}>{children}</MDXProvider>
        </div>
        {(tags.length > 0 || truncated) && (
          <footer className="row margin-vert--lg">
            {truncated && (
              <div className="col text--right">
                <Link
                  to={metadata.permalink}
                  aria-label={`Read more about ${title}`}>
                  <strong>
                    <Translate
                      id="theme.blog.post.readMore"
                      description="The label used in blog post item excerpts to link to full blog posts">
                      Read More
                    </Translate>
                  </strong>
                </Link>
              </div>
            )}
          </footer>
        )}
      </article>
    </>
  );
}

export default BlogPostItem;
