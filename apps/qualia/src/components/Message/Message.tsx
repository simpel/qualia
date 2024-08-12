import { InfoCircledIcon } from '@radix-ui/react-icons';
import { Callout } from '@radix-ui/themes';

export type IMessage = {
  message?: string;
  status: '200' | '400';
};

export const Message = ({ message, status }: IMessage) => {
  return message ? (
    <Callout.Root variant="surface" color={status === '200' ? 'green' : 'red'}>
      <Callout.Icon>
        <InfoCircledIcon />
      </Callout.Icon>
      <Callout.Text>{message}</Callout.Text>
    </Callout.Root>
  ) : null;
};
