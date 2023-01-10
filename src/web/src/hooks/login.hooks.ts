import { useMutation } from '@tanstack/react-query';

function useLoginMutation() {
  return useMutation({
    // @ts-ignore
    mutationFn: () => {
      console.log('loggedIn');
      return {};
    },
  });
}

export { useLoginMutation };
