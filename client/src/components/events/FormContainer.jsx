import styles from '../../styleModules/EditEvent.module.css';

const date = new Date;
date.setDate(date.getDate() + 1);
const minDate = date.toISOString().split('T')[0];

const formContainer = ({ isMatch, isPending, eventDetails, formDisable, handleSubmit, handleChanges, buttonText, isError }) => {

    let contents

    if (isMatch) {
        contents = <>
            {isPending && <h1 className={styles.loading}>Loading...</h1>}
        </>
    }
    else {
        contents = <></>
    }

    return (
        <>
            {contents}
            {isError && <h1 className={styles.loading}>{isError}</h1>}
            {eventDetails && <div className={styles.formContainer}>
                <form className={styles.forForm} onSubmit={handleSubmit}>
                    <h2>{buttonText}</h2>
                    <div>
                        <label> Event Name</label>
                        <input type="text" disabled={formDisable} required value={eventDetails.name} onChange={(e) => handleChanges(e, "name")} />
                    </div>
                    <div>
                        <label> Event Detail</label>
                        <input type="text" disabled={formDisable} required value={eventDetails.description} onChange={(e) => handleChanges(e, "description")} />
                    </div>
                    <div>
                        <label> Start Date</label>
                        {isMatch && <input type="text" disabled value={eventDetails.start} onChange={(e) => handleChanges(e, "start")} />}
                        {!isMatch && <input type="date" required disabled={formDisable} min={minDate} value={eventDetails.start} onChange={(e) => handleChanges(e, "start")} />}
                    </div>
                    <div>
                        <label> End Date</label>
                        {isMatch && <input type="text" disabled value={eventDetails.end} onChange={(e) => handleChanges(e, "end")} />}
                        {!isMatch && <input type="date" required disabled={formDisable} min={eventDetails.start ? eventDetails.start : minDate} value={eventDetails.end} onChange={(e) => handleChanges(e, "end")} />}
                    </div>
                    <div>
                        <label> Capacity</label>
                        <input type="number" disabled={formDisable} required value={eventDetails.capacity} onChange={(e) => handleChanges(e, "capacity")} />
                    </div>
                    <div>
                        <button disabled={formDisable}>{buttonText}</button>
                    </div>
                </form>
            </div>}
        </>
    );
}

export default formContainer;