import { Flex, Heading, Link, Text } from '@chakra-ui/layout';
import { NextPage } from 'next';
import NextError from 'next/error';
import React, { useEffect } from 'react';
import { Card } from '../../../../components/Card';
import ProgressCardContent from '../../../../components/ProgressCardContent';
import { useSponsorWithEventsLazyQuery } from '../../../../generated/graphql';
import { useParam } from '../../../../hooks/useParam';
import styles from '../../../../styles/Page.module.css';
import { Layout } from '../../shared/components/Layout';
import { DashboardLoading } from '../../shared/components/DashboardLoading';
import { EventList } from 'modules/dashboard/shared/components/EventList';

export const SponsorPage: NextPage = () => {
  const { param: sponsorId, isReady } = useParam('id');
  const [getSponsor, { loading, error, data }] = useSponsorWithEventsLazyQuery({
    variables: { sponsorId },
  });
  const { sponsorWithEvents: sponsor } = data ?? {};

  useEffect(() => {
    if (isReady) {
      getSponsor();
    }
  }, [isReady]);

  const isLoading = loading || !isReady || !data;
  if (isLoading || error)
    return <DashboardLoading loading={isLoading} error={error} />;
  if (!sponsor) return <NextError statusCode={404} title="Sponsor not found" />;

  return (
    <Layout>
      <Card className={styles.card}>
        <ProgressCardContent>
          <Heading data-cy="name" as="h2" fontWeight="normal" mb="2">
            {sponsor.name}
          </Heading>
        </ProgressCardContent>
      </Card>

      <Card mt="4">
        <Heading as="h4" size="md" fontWeight="normal">
          Details{' '}
        </Heading>
        <Flex mt="2" justifyContent="space-between">
          <Text data-cy="type">Type: {sponsor.type}</Text>
          <Text data-cy="website">
            Website: <Link>{sponsor.website}</Link>
          </Text>
        </Flex>
      </Card>
      <EventList
        title={'Sponsored Events'}
        events={sponsor.event_sponsors.map(({ event }) => ({ ...event }))}
      />
    </Layout>
  );
};
