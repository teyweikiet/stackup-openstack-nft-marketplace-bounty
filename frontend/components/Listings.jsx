import { Grid } from '@mantine/core'
import { ItemCard } from './ItemCard'

import { useMarketplaceContractRead } from '@/hooks/useMarketplaceContract'

export function Listings () {
  const { data: listingCount } = useMarketplaceContractRead('listingCount')

  return (
    <Grid>
      {
        Array.from({ length: listingCount ?? 0 }).map((_, idx) => (
          <Grid.Col
            key={idx}
            md={4}
            sm={6}
            xs={12}
          >
            <ItemCard id={idx} />
          </Grid.Col>
        ))
      }
    </Grid>
  )
}
