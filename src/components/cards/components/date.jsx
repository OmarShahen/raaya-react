import { format, formatDistance  } from 'date-fns'


const CardDate = ({ creationDate, updateDate }) => {

    return <div className="card-date-container grey-text">
        <div>
            <span>{format(new Date(creationDate), 'dd/MM/yyyy')}</span>
        </div>
            <div>
                {/*
                    !updateDate || new Date(creationDate).getTime() === new Date(updateDate).getTime() ?
                    <span>
                        {formatDistance(new Date(creationDate), new Date(), { addSuffix: true })}
                    </span>
                    :
                    <span>
                        last modified({formatDistance(new Date(updateDate), new Date(), { addSuffix: true })})
                    </span>
*/}
            </div>
    </div>
}

export default CardDate