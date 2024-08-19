'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/shadcn/components/ui/breadcrumb';
import dictionary from '@qualia/dictionary';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';

export const BreadCrumbs = () => {
  const paths = usePathname();

  const pathSegments = paths.split('/');
  pathSegments.shift();

  let activePath = '/';

  return (
    <div className="container mx-auto mt-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">
              {dictionary.breadcrumb_home}
            </BreadcrumbLink>
          </BreadcrumbItem>
          {pathSegments.map((segment) => {
            activePath = `${activePath}${segment}/`;

            return (
              <Fragment key={activePath}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={activePath}>
                    {segment.charAt(0).toUpperCase() + segment.slice(1)}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};
