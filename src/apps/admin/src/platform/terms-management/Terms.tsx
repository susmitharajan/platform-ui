/**
 * Terms management wrapper component
 */
import { FC, useContext, useMemo } from 'react'
import { Outlet, Routes } from 'react-router-dom'

import { routerContext, RouterContextData } from '~/libs/core'

import { adminRoutes } from '../../admin-app.routes'
import { platformRouteId, termsRouteId } from '../../config/routes.config'

/**
 * The router outlet with layout for terms management.
 */
export const Terms: FC = () => {
    const childRoutes = useChildRoutes()

    return (
        <>
            <Outlet />
            <Routes>{childRoutes}</Routes>
        </>
    )
}

function useChildRoutes(): Array<JSX.Element> | undefined {
    const { getRouteElement }: RouterContextData = useContext(routerContext)
    const childRoutes = useMemo(
        () => adminRoutes[0].children
            ?.find(r => r.id === platformRouteId)
            ?.children?.find(r => r.id === termsRouteId)
            ?.children?.map(getRouteElement),
        [], // eslint-disable-line react-hooks/exhaustive-deps -- missing dependency: getRouteElement
    )
    return childRoutes
}

export default Terms