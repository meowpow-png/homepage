import type {JSX, ReactNode} from "react";

import {AppShell, Footer, Navigation} from '@/shared/components'
import {type NavigationPage, resolveRoute, type Route, RouterContext, useNavigation,} from '@/shared/routing'

import {type BlogPost, getBlogPost} from '@/content/blog'
import {BlogPostPage} from '@/sections/Blog'
import {NotFound} from '@/sections/NotFound'

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

export function resolveBlogPost(pathname: string) {
    if (!pathname.startsWith('/blog/')) {
        return undefined
    }
    return getBlogPost(pathname.slice('/blog/'.length))
}

export function resolveCurrentPage(
    route: Route | undefined,
    isBlogPost: boolean,
): NavigationPage | undefined {
    if (route) {
        return route.currentPage
    }
    return isBlogPost ? 'blog' : undefined
}

export function renderPage(
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
