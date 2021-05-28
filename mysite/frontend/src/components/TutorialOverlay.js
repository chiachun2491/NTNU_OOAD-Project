import { Popover, OverlayTrigger, Button } from 'react-bootstrap';

function TutorialPopover(title = null, content = null, button = null, handleEvent = null) {
    if (title === null && content === null && button === null) return <></>;
    return (
        <Popover>
            {title !== null && <Popover.Title as={'h3'}>{title}</Popover.Title>}
            <Popover.Content>
                {content !== null && <div>{content}</div>}
                {button !== null && (
                    <div className={'d-flex mt-2'}>
                        <Button
                            variant={'outline-brown'}
                            size={'sm'}
                            className={'ml-auto'}
                            onClick={() => handleEvent()}>
                            {button}
                        </Button>
                    </div>
                )}
            </Popover.Content>
        </Popover>
    );
}

const TutorialOverlayTrigger = (props) => (
    <OverlayTrigger
        placement={props.placement ? props.placement : 'top'}
        overlay={props.overlay}
        show={props.show ? props.show : false}>
        {props.children}
    </OverlayTrigger>
);

export { TutorialPopover, TutorialOverlayTrigger };
