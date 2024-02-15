
import { toast } from 'sonner';

interface Props {
    type: string;
    message: string;
}

export const Notify = ({ type, message }: Props) => {
    const showToast = () => {
        switch (type) {
            case 'success':
                toast.success(message);
                break;
            case 'error':
                toast.error(message);
                break;
            case 'warning':
                toast.warning(message);
                break;
            case 'info':
                toast.info(message);
                break;
            default:
                break;
        }
    };

    return (
        <>
            {showToast()}
        </>
    );
}
