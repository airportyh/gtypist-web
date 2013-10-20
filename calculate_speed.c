Calculate speed:


    /* calculate the speeds */
    test_time = (double)elapsed_time / (double)60.0;
    if( elapsed_time > 0 )
      {
        /* calculate speed values */
        cpm = (double)total_chars / test_time;
        adjusted_cpm = (double)( total_chars - ( errcount * 5 ) ) / test_time;

        /* limit speed values */
        cpm = MIN( cpm, 9999.99 );
        adjusted_cpm = MAX( MIN( adjusted_cpm, 9999.99 ), 0 );

        /* remove errors in adjusted speed */
        if( adjusted_cpm < 0.01 )
    adjusted_cpm = 0;
      }
    else
      /* unmeasurable elapsed time - use big numbers */
      cpm = adjusted_cpm = (double)9999.99;