import { useRouter } from '@tanstack/react-router'

const Breadcrumbs = () => {
  const router = useRouter()

  const breadcrumbs = router.state.matches.map((match) => {
    console.log('match', match)
    // const { routeContext } = match
    // return {
    //   title: routeContext.getTitle(),
    //   path: match.path
    // }
    return match.pathname
  })
  return breadcrumbs
}

export default Breadcrumbs
