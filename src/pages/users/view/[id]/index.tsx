import AppLayout from 'layout/app-layout';
import React from 'react';
import NextLink from 'next/link';
import { Text, Box, Spinner, Link, Stack, Flex, Center, List } from '@chakra-ui/react';
import { getUserById } from 'apiSdk/users';
import { Error } from 'components/error';
import { UserInterface } from 'interfaces/user';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import Breadcrumbs from 'components/breadcrumb';
import { FormWrapper } from 'components/form-wrapper';
import { FormListItem } from 'components/form-list-item';
import { compose } from 'lib/compose';

function UserViewPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading } = useSWR<UserInterface>(
    () => (id ? `/users/${id}` : null),
    () => getUserById(id),
  );
  return (
    <AppLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            {
              label: 'Users',
              link: '/Users',
            },
            {
              label: 'User Details',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {isLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <>
            <FormWrapper>
              <Stack direction="column" spacing={2} mb={4}>
                <Text
                  sx={{
                    fontSize: '1.875rem',
                    fontWeight: 700,
                    color: 'base.content',
                  }}
                >
                  Menu Item Details
                </Text>
              </Stack>
              <List spacing={3} w="100%">
                <FormListItem label="Email:" text={data?.email} />

                <FormListItem label="First Name:" text={data?.firstName} />

                <FormListItem label="First Name:" text={data?.lastName} />

                <FormListItem label="Created At:" text={data?.created_at as unknown as string} />

                <FormListItem label="Updated At:" text={data?.updated_at as unknown as string} />
              </List>
            </FormWrapper>
          </>
        )}
      </Box>
    </AppLayout>
  );
  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            User Detail View
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {isLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <Stack direction="column" spacing={2}>
            <Flex>
              <Text fontSize="lg" fontWeight="bold" as="span">
                Email:
              </Text>
              <Text ml={4} fontSize="lg" as="span">
                {data?.email}
              </Text>
            </Flex>
            <Flex>
              <Text fontSize="lg" fontWeight="bold" as="span">
                First Name:
              </Text>
              <Text ml={4} fontSize="lg" as="span">
                {data?.firstName}
              </Text>
            </Flex>
            <Flex>
              <Text fontSize="lg" fontWeight="bold" as="span">
                Last Name:
              </Text>
              <Text ml={4} fontSize="lg" as="span">
                {data?.lastName}
              </Text>
            </Flex>
          </Stack>
        )}
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'user',
    operation: AccessOperationEnum.READ,
  }),
)(UserViewPage);
