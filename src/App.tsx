import type {JSX, ReactNode} from "react";

import {AppShell} from '@/shared/components/AppShell'
import {Footer} from '@/shared/components/Footer'
import {Navigation} from '@/shared/components/Navigation'
import {type NavigationPage, resolveRoute, type Route, RouterContext, useNavigation,} from '@/shared/routing'

import {type BlogPost, getBlogPost} from '@/content/blog/posts'
import {BlogPostPage, NotFound} from '@/sections/'

export function App(): JSX.Element {
    const navigation = useNavigation()
    const route = resolveRoute(navigation.pathname)
    const blogPost = resolveBlogPost(navigation.pathname)
    const currentPage = resolveCurrentPage(
        route,
        blogPost !== undefined,
    )
    return (
        <RouterContext.Provider value={navigation}>
            <AppShell
                header={<Navigation currentPage={currentPage}/>}
                footer={<Footer/>}
            >
                {renderPage(route, blogPost)}
            </AppShell>
        </RouterContext.Provider>
    )
}

function resolveBlogPost(pathname: string) {
    if (!pathname.startsWith('/blog/')) {
        return undefined
    }
    return getBlogPost(pathname.slice('/blog/'.length))
}

function resolveCurrentPage(
    route: Route | undefined,
    isBlogPost: boolean,
): NavigationPage | undefined {
    if (route) {
        return route.currentPage
    }
    return isBlogPost ? 'blog' : undefined
}

function renderPage(
    route: Route | undefined,
    blogPost: BlogPost | undefined,
): ReactNode {
    if (route) {
        return route.render()
    }
    if (blogPost) {
        return <BlogPostPage post={blogPost}/>
    }
    return <NotFound/>
}
