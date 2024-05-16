import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/_layout/invoices')({
  component: () => (
    <div>
      Hello /_auth/invoices!
      <div>
        <Link to="/invoices/$id" params={{ id: '123' }}>
          Invoice 123
        </Link>
      </div>
    </div>
  )
})
