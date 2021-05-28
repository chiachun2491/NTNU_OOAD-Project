import { Spinner } from 'react-bootstrap';

const Loading = () => (
    <div className='d-flex align-items-center justify-content-center'>
        <Spinner animation='border' variant='brown' size={'sm'} className={'mr-2'} /> 載入中...
    </div>
);

export { Loading };
